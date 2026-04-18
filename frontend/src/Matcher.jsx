import { useState, useRef } from 'react'
import { motion } from 'framer-motion'

function Matcher({ companyConfig }) {
  const [step, setStep] = useState(1)
  const [userSkills, setUserSkills] = useState('')
  const [jd, setJd] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [userName, setUserName] = useState('')
  const [userTitle, setUserTitle] = useState('')
  const [inputMode, setInputMode] = useState(null)
  const [fileName, setFileName] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef()

  const accentColor = companyConfig?.color || '#38bdf8'

  async function handleFileUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setFileName(file.name)
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('resume', file)
      const res = await fetch('/api/upload/resume', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (data.text) {
        setUserSkills(data.text)
      } else {
        setFileName(null)
        alert('Could not read file. Try a different format.')
      }
    } catch (err) {
      console.error(err)
      setFileName(null)
      alert('Upload failed. Make sure your server is running.')
    } finally {
      setUploading(false)
    }
  }

  async function handleMatch() {
    if (!userSkills.trim() || !jd.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/match/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: jd, userSkills })
      })
      const data = await res.json()
      setResult({
        score: data.score ?? 0,
        matched: Array.isArray(data.matched) ? data.matched : [],
        missing: Array.isArray(data.missing) ? data.missing : [],
        summary: data.summary ?? 'Could not analyze. Try again.'
      })
      setStep(3)
    } catch (err) {
      setResult({ score: 0, matched: [], missing: [], summary: 'Backend error. Make sure your server is running!' })
      setStep(3)
    } finally {
      setLoading(false)
    }
  }

  async function handleDownloadPDF() {
    if (!result) return
    setPdfLoading(true)
    try {
      const res = await fetch('/api/pdf/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userName || 'Candidate',
          jobTitle: userTitle || 'Professional',
          summary: result.summary,
          matchedSkills: result.matched,
          skills: userSkills.split(/[\n,]/).map(s => s.trim()).filter(s => s.length > 0 && s.length < 40)
        })
      })
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'liveproof-resume.pdf'
      a.click()
    } catch (err) {
      console.error(err)
    } finally {
      setPdfLoading(false)
    }
  }

  function reset() {
    setStep(1)
    setUserSkills('')
    setJd('')
    setResult(null)
    setUserName('')
    setUserTitle('')
    setInputMode(null)
    setFileName(null)
  }

  return (
    <section id="matcher" className="bg-black py-28 px-6 border-t border-zinc-800">
      <div className="max-w-3xl mx-auto">

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-white text-4xl md:text-5xl font-black text-center tracking-tighter mb-4"
        >
          Match your <span style={{ color: accentColor }}>resume</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-zinc-500 font-mono text-center mb-12"
        >
          ›› free, instant, no account needed
        </motion.p>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {[1, 2, 3].map(n => (
            <div key={n} className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={{
                  backgroundColor: step >= n ? accentColor : '#27272a',
                  color: step >= n ? '#000' : '#71717a'
                }}
              >
                {n}
              </div>
              {n < 3 && (
                <div
                  className="w-12 h-0.5 transition-all"
                  style={{ backgroundColor: step > n ? accentColor : '#27272a' }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4"
          >
            <p className="text-zinc-400 font-mono text-sm">Step 1 — Tell us about yourself</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-zinc-500 font-mono text-xs mb-2 block">Your name</label>
                <input
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full bg-black text-zinc-300 font-mono text-sm p-3 rounded-xl border border-zinc-700 focus:border-sky-500 focus:outline-none placeholder-zinc-600"
                />
              </div>
              <div>
                <label className="text-zinc-500 font-mono text-xs mb-2 block">Your target job title</label>
                <input
                  value={userTitle}
                  onChange={e => setUserTitle(e.target.value)}
                  placeholder="e.g. Frontend Developer"
                  className="w-full bg-black text-zinc-300 font-mono text-sm p-3 rounded-xl border border-zinc-700 focus:border-sky-500 focus:outline-none placeholder-zinc-600"
                />
              </div>
            </div>

            {/* Input mode selector */}
            {!inputMode && (
              <div>
                <label className="text-zinc-500 font-mono text-xs mb-3 block">How do you want to add your background?</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setInputMode('upload')}
                    className="flex flex-col items-center gap-3 p-5 rounded-xl border border-zinc-700 hover:border-sky-600 bg-black transition-colors cursor-pointer"
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round"/>
                      <polyline points="17 8 12 3 7 8" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="12" y1="3" x2="12" y2="15" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <div className="text-center">
                      <p className="text-white font-bold text-sm">Upload Resume</p>
                      <p className="text-zinc-500 font-mono text-xs mt-1">PDF, TXT, DOCX supported</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setInputMode('type')}
                    className="flex flex-col items-center gap-3 p-5 rounded-xl border border-zinc-700 hover:border-sky-600 bg-black transition-colors cursor-pointer"
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="18" height="18" rx="3" stroke="#38bdf8" strokeWidth="1.5"/>
                      <path d="M8 12h8M8 8h5M8 16h6" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <div className="text-center">
                      <p className="text-white font-bold text-sm">Type My Skills</p>
                      <p className="text-zinc-500 font-mono text-xs mt-1">list them separated by commas</p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Upload mode */}
            {inputMode === 'upload' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-zinc-500 font-mono text-xs">Upload your resume</label>
                  <button
                    onClick={() => { setInputMode(null); setFileName(null); setUserSkills('') }}
                    className="text-zinc-600 font-mono text-xs hover:text-zinc-400"
                  >
                    change method
                  </button>
                </div>

                <div
                  onClick={() => !uploading && fileRef.current.click()}
                  className="w-full border-2 border-dashed border-zinc-700 hover:border-sky-600 rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-colors"
                >
                  {uploading ? (
                    <>
                      <div className="flex gap-2">
                        <span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <p className="text-zinc-400 font-mono text-sm">Reading your resume...</p>
                    </>
                  ) : fileName ? (
                    <>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17l-5-5" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <p className="text-emerald-400 font-mono text-sm">{fileName}</p>
                      <p className="text-zinc-600 font-mono text-xs">click to change file</p>
                    </>
                  ) : (
                    <>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round"/>
                        <polyline points="17 8 12 3 7 8" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="12" y1="3" x2="12" y2="15" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      <p className="text-zinc-400 font-mono text-sm">click to upload your resume</p>
                      <p className="text-zinc-600 font-mono text-xs">PDF, TXT, DOCX supported</p>
                    </>
                  )}
                </div>

                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.txt,.docx,application/pdf,text/plain"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {userSkills && !uploading && (
                  <div className="mt-3 p-3 bg-emerald-950 rounded-xl border border-emerald-800 flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <p className="text-emerald-400 font-mono text-xs">Resume loaded and ready to analyze</p>
                  </div>
                )}
              </div>
            )}

            {/* Type mode */}
            {inputMode === 'type' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-zinc-500 font-mono text-xs">List your skills</label>
                  <button
                    onClick={() => { setInputMode(null); setUserSkills('') }}
                    className="text-zinc-600 font-mono text-xs hover:text-zinc-400"
                  >
                    change method
                  </button>
                </div>
                <textarea
                  value={userSkills}
                  onChange={e => setUserSkills(e.target.value)}
                  placeholder="React, Node.js, Python, SQL, project management, communication, leadership..."
                  rows={5}
                  className="w-full bg-black text-zinc-300 font-mono text-sm p-4 rounded-xl border border-zinc-700 focus:border-sky-500 focus:outline-none resize-none placeholder-zinc-600"
                />
              </div>
            )}

            <button
              onClick={() => userSkills.trim() && setStep(2)}
              disabled={!userSkills.trim() || !inputMode || uploading}
              className="w-full disabled:opacity-40 text-black font-bold py-3 rounded-xl transition-colors cursor-pointer"
              style={{ backgroundColor: accentColor }}
            >
              Next — Paste Job Description →
            </button>
          </motion.div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4"
          >
            <p className="text-zinc-400 font-mono text-sm">Step 2 — Paste the job description</p>

            <textarea
              value={jd}
              onChange={e => setJd(e.target.value)}
              placeholder="Paste the full job description here — from LinkedIn, Indeed, company website, anywhere..."
              rows={10}
              className="w-full bg-black text-zinc-300 font-mono text-sm p-4 rounded-xl border border-zinc-700 focus:border-sky-500 focus:outline-none resize-none placeholder-zinc-600"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-xl border border-zinc-700 text-zinc-400 font-mono text-sm hover:border-zinc-500 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleMatch}
                disabled={loading || !jd.trim()}
                className="flex-1 disabled:opacity-40 text-black font-bold py-3 rounded-xl transition-colors cursor-pointer"
                style={{ backgroundColor: accentColor }}
              >
                {loading ? 'Analyzing with AI...' : 'Analyze My Match →'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3 — Results */}
        {step === 3 && result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4"
          >
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-zinc-400 font-mono text-sm">Your match score</span>
                <span
                  className="text-6xl font-black"
                  style={{ color: result.score >= 70 ? '#34d399' : result.score >= 40 ? accentColor : '#f87171' }}
                >
                  {result.score}%
                </span>
              </div>

              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mb-6">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result.score}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: result.score >= 70 ? '#34d399' : result.score >= 40 ? accentColor : '#f87171' }}
                />
              </div>

              <p className="text-zinc-400 font-mono text-sm border-t border-zinc-800 pt-4 leading-relaxed">
                {result.summary}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                <p className="text-emerald-400 font-mono text-xs mb-3">✓ You have these</p>
                <div className="flex flex-wrap gap-2">
                  {result.matched.length > 0
                    ? result.matched.map((s, i) => (
                        <span key={i} className="bg-emerald-950 text-emerald-400 text-xs font-mono px-2 py-1 rounded-lg">{s}</span>
                      ))
                    : <span className="text-zinc-600 font-mono text-xs">None matched</span>
                  }
                </div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                <p className="text-red-400 font-mono text-xs mb-3">✗ You're missing</p>
                <div className="flex flex-wrap gap-2">
                  {result.missing.length > 0
                    ? result.missing.map((s, i) => (
                        <span key={i} className="bg-red-950 text-red-400 text-xs font-mono px-2 py-1 rounded-lg">{s}</span>
                      ))
                    : <span className="text-zinc-600 font-mono text-xs">Nothing critical missing</span>
                  }
                </div>
              </div>
            </div>

            <button
              onClick={handleDownloadPDF}
              disabled={pdfLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold py-3 rounded-xl transition-colors"
            >
              {pdfLoading ? 'Generating PDF...' : 'Download Custom Resume PDF →'}
            </button>

            <button
              onClick={reset}
              className="w-full border border-zinc-700 hover:border-zinc-500 text-zinc-400 font-mono text-sm py-3 rounded-xl transition-colors"
            >
              ← Start over with a new resume
            </button>
          </motion.div>
        )}

      </div>
    </section>
  )
}

export default Matcher