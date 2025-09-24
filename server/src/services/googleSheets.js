import { google } from 'googleapis'

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

const sheets = google.sheets({ version: 'v4', auth })

const HEADERS = [
  'Timestamp',
  'Name',
  'Role Applied',
  'Job ID',
  'Phone',
  'Email',
  'Resume URL',
  'Status'
]

async function ensureHeaders() {
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Applications!A1:H1',
    })
    const firstRow = res.data.values?.[0] || []
    const missing = HEADERS.some((h, i) => firstRow[i] !== h)
    if (missing) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Applications!A1:H1',
        valueInputOption: 'RAW',
        requestBody: { values: [HEADERS] },
      })
      console.log('✅ Headers ensured in Applications sheet')
    }
  } catch (err) {
    console.error('❌ Failed to ensure headers:', err.message)
  }
}

export async function appendApplicantToSheet({
  jobId,
  jobTitle,
  firstName,
  lastName,
  email,
  phone,
  resumeUrl,
}) {
  try {
    await ensureHeaders()

    const values = [[
      new Date().toISOString(),
      `${firstName} ${lastName}`,
      jobTitle,
      jobId,
      phone || '',
      email,
      resumeUrl,
      'Application Received'
    ]]

    console.log('📤 Sending values to Google Sheets:', values)

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Applications!A:H',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    })

    console.log('✅ Applicant appended to Applications sheet')
  } catch (err) {
    console.error('❌ Failed to append to Google Sheet:', err.message)
  }
}

// 🆕 Fetch applicants
export async function getApplicantsFromSheet() {
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Applications!A2:H',
    })
    const rows = res.data.values || []
    return rows.map((row, idx) => ({
      id: idx + 1,
      timestamp: row[0],
      name: row[1],
      role: row[2],
      jobId: row[3],
      phone: row[4],
      email: row[5],
      resumeUrl: row[6],
      status: row[7] || 'Application Received'
    }))
  } catch (err) {
    console.error('❌ Failed to read from Google Sheets:', err.message)
    return []
  }
}
