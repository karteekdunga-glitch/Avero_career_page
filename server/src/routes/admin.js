// server/src/routes/admin.js
import express from "express";
import { google } from "googleapis";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// ✅ Google Sheets auth
const auth = new google.auth.GoogleAuth({
  credentials: {
    type: "service_account",
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_NAME = "Applications"; // must match sheet tab

// ✅ Normalize rows into objects
function normalizeRows(rows) {
  if (!rows || rows.length < 2) return [];
  const headers = rows[0];
  return rows.slice(1).map((row, index) => {
    const obj = {};
    headers.forEach((h, i) => (obj[h.trim()] = row[i] || ""));
    return {
      rowIndex: index + 2, // actual sheet row (including header)
      name: obj.Name || "",
      email: obj.Email || "",
      phone: obj.Phone || "",
      role: obj["Role Applied"] || "",
      jobId: obj["Job ID"] || "",
      resumeUrl: obj["Resume URL"] || "",
      status: obj.Status || "Application Received",
    };
  });
}

// ✅ GET applications
router.get("/applications", authMiddleware, async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: SHEET_NAME,
    });
    const rows = response.data.values;
    const apps = normalizeRows(rows);
    res.json(apps);
  } catch (err) {
    console.error("❌ Failed to fetch:", err.message);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// ✅ PATCH update status in existing cell
router.patch("/applications/:rowIndex/status", authMiddleware, async (req, res) => {
  const { rowIndex } = req.params; // rowIndex comes directly from frontend
  const { status } = req.body;

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: SHEET_NAME,
    });
    const rows = response.data.values;
    const headers = rows[0];
    let statusCol = headers.indexOf("Status");

    if (statusCol === -1) {
      // If Status column doesn’t exist, add it
      headers.push("Status");
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A1`,
        valueInputOption: "RAW",
        requestBody: { values: [headers] },
      });
      statusCol = headers.length - 1;
    }

    const cellRef = `${SHEET_NAME}!${String.fromCharCode(65 + statusCol)}${rowIndex}`;

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: cellRef,
      valueInputOption: "RAW",
      requestBody: { values: [[status]] },
    });

    res.json({ ok: true, rowIndex, status });
  } catch (err) {
    console.error("❌ Failed to update status:", err.message);
    res.status(500).json({ error: "Failed to update status" });
  }
});

export default router;
