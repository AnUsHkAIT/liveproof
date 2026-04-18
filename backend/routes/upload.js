const express = require('express')
const router = express.Router()
const multer = require('multer')
const fs = require('fs')
const PDFParser = require('pdf2json')

const upload = multer({ dest: 'uploads/' })

router.post('/resume', upload.single('resume'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })

  const filePath = req.file.path
  const originalName = req.file.originalname.toLowerCase()

  try {
    let text = ''

    if (originalName.endsWith('.pdf')) {
      text = await new Promise((resolve, reject) => {
        const pdfParser = new PDFParser()

        pdfParser.on('pdfParser_dataError', err => reject(err))

        pdfParser.on('pdfParser_dataReady', pdfData => {
          const pages = pdfData.Pages || []
          const allText = pages.map(page =>
            (page.Texts || [])
              .map(t => {
                try { return decodeURIComponent(t.R?.[0]?.T || '') }
                catch { return t.R?.[0]?.T || '' }
              })
              .join(' ')
          ).join('\n')
          resolve(allText)
        })

        pdfParser.loadPDF(filePath)
      })

    } else if (originalName.endsWith('.docx')) {
      const mammoth = require('mammoth')
      const result = await mammoth.extractRawText({ path: filePath })
      text = result.value

    } else {
      text = fs.readFileSync(filePath, 'utf8')
    }

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

    if (!text || text.trim().length < 5) {
      return res.status(400).json({ error: 'Could not extract text from file' })
    }

    res.json({ text: text.trim() })

  } catch (err) {
    console.error('Upload error:', err)
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    res.status(500).json({ error: 'Could not read file: ' + err.message })
  }
})

module.exports = router