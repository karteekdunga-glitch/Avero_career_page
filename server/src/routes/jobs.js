import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Job } from '../models/Job.js'

const router = express.Router()

// Get path to seed JSON
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const seedPath = path.resolve(__dirname, '..', '..', 'seed', 'jobs.seed.json')

// Helper to load seed data
function loadSeed() {
  const raw = fs.readFileSync(seedPath, 'utf-8')
  return JSON.parse(raw)
}

// GET /api/jobs
router.get('/', async (req, res) => {
  const { page = 1, limit = 9, q = '', location = '', type = '' } = req.query
  const skip = (Number(page) - 1) * Number(limit)

  try {
    // If MongoDB is connected, try fetching from DB
    if (Job.db && Job.db.readyState === 1) {
      const filter = {
        ...(q ? { title: { $regex: q, $options: 'i' } } : {}),
        ...(location ? { location: { $regex: location, $options: 'i' } } : {}),
        ...(type ? { type: { $regex: type, $options: 'i' } } : {})
      }

      const [items, total] = await Promise.all([
        Job.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
        Job.countDocuments(filter)
      ])

      if (total > 0) {
        return res.json({ items, total, page: Number(page), limit: Number(limit) })
      }
    }
  } catch (err) {
    console.warn('MongoDB not available, using seed file:', err.message)
  }

  // Fallback → jobs.seed.json
  let jobs = loadSeed().filter(j => j._id) // filter out junk entries
  if (q) jobs = jobs.filter(j => j.title.toLowerCase().includes(q.toLowerCase()))
  if (location) jobs = jobs.filter(j => j.location.toLowerCase().includes(location.toLowerCase()))
  if (type) jobs = jobs.filter(j => (j.type || '').toLowerCase().includes(type.toLowerCase()))

  const total = jobs.length
  const paged = jobs.slice(skip, skip + Number(limit))

  res.json({ items: paged, total, page: Number(page), limit: Number(limit) })
})

// GET /api/jobs/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    if (Job.db && Job.db.readyState === 1) {
      const job = await Job.findById(id)
      if (job) return res.json(job)
    }
  } catch {}

  const data = loadSeed()
  const job = data.find(j => j._id === id)
  if (!job) return res.status(404).json({ message: 'Job not found' })

  res.json(job)
})

export default router
