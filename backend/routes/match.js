const express = require('express')
const router = express.Router()
const Groq = require('groq-sdk')

const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

router.post('/analyze', async (req, res) => {
  const { jobDescription, userSkills } = req.body

  if (!jobDescription || !userSkills) {
    return res.status(400).json({ error: 'Job description and user skills are required' })
  }

  try {
    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: `You are an expert career coach and technical recruiter AI. Analyze this job description and compare it against the candidate's skills or resume.

Candidate's skills/resume:
${userSkills}

Job Description:
${jobDescription}

Instructions:
- Extract all skills, technologies, experiences, and qualifications from both the candidate profile and job description
- Match them intelligently — e.g. "JS" matches "JavaScript", "ML" matches "Machine Learning"
- Be fair and comprehensive in your analysis
- The score should reflect genuine fit

Respond ONLY with a valid JSON object, no extra text, no markdown, no backticks:
{
  "score": <number 0-100 reflecting genuine match percentage>,
  "matched": [<skills/qualifications the candidate HAS that the JD requires>],
  "missing": [<important skills/qualifications in JD that candidate lacks>],
  "summary": "<2 sentence honest assessment of fit and what would strengthen the application>"
}`
        }
      ],
      temperature: 0.3,
    })

    const raw = completion.choices[0].message.content.trim()
    const result = JSON.parse(raw)
    res.json(result)

  } catch (err) {
    console.error('Groq Error:', err.message)
    res.status(500).json({ error: 'AI analysis failed' })
  }
})

module.exports = router