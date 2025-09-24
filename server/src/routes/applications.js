import express from 'express'
import multer from 'multer'
import path from 'path'
import { appendApplicantToSheet } from '../services/googleSheets.js'

const router = express.Router()

// Multer storage: save PDF with timestamp + original filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'uploads'))
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now()
    const safeName = file.originalname.replace(/\s+/g, '_') // replace spaces with _
    cb(null, `${timestamp}-${safeName}`)
  },
})

// Multer filter: allow only PDFs
function fileFilter(req, file, cb) {
  if (file.mimetype === 'application/pdf') {
    cb(null, true)
  } else {
    cb(new Error('Only PDF files are allowed'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
})

/**
 * Handle job application submission
 */
router.post('/', upload.single('resume'), async (req, res) => {
  try {
    console.log('📥 Incoming application...')
    console.log('➡️ Body:', req.body)
    console.log('➡️ File:', req.file)

    const { jobId, jobTitle, firstName, lastName, email, phone } = req.body

    if (!req.file) {
      return res.status(400).json({ error: 'Resume is required and must be a PDF' })
    }

    const resumeUrl = `${process.env.BASE_URL}/uploads/${req.file.filename}`

    await appendApplicantToSheet({
      jobId,
      jobTitle,
      firstName,
      lastName,
      email,
      phone,
      resumeUrl,
    })

    console.log('✅ Application processed successfully')
    res.json({ ok: true, message: 'Application submitted successfully' })
  } catch (err) {
    console.error('❌ Application submission failed:', err.message)
    res.status(500).json({ error: 'Application submission failed' })
  }
})

export default router
