const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
require('dotenv').config()

const db = require('./database')
const matchRoute = require('./routes/match')
const pdfRoute = require('./routes/pdf')
const uploadRoute = require('./routes/upload')

const app = express()
const PORT = process.env.PORT || 5000

const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir)

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

app.use('/api/match', matchRoute)
app.use('/api/pdf', pdfRoute)
app.use('/api/upload', uploadRoute)

app.post('/api/track/visit', (req, res) => {
  const { company } = req.body
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || ''
  const insert = db.prepare('INSERT INTO visits (company, ip) VALUES (?, ?)')
  insert.run(company || 'direct', ip)
  const total = db.prepare('SELECT COUNT(*) as count FROM visits').get()
  res.json({ visits: total.count })
})

app.get('/api/track/visits', (req, res) => {
  const total = db.prepare('SELECT COUNT(*) as count FROM visits').get()
  const byCompanyRows = db.prepare('SELECT company, COUNT(*) as count FROM visits GROUP BY company').all()
  const byCompany = {}
  byCompanyRows.forEach(row => { byCompany[row.company] = row.count })
  const recent = db.prepare('SELECT company, timestamp FROM visits ORDER BY id DESC LIMIT 10').all()
  res.json({ total: total.count, byCompany, recent })
})

const frontendDist = path.join(__dirname, '../frontend/dist')
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist))
  app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})