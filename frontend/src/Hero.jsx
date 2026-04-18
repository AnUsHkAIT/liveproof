import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const phrases = [
  "Upload your resume. Paste a job description. Get your match score.",
  "Find out exactly what skills you're missing.",
  "Download a custom tailored resume PDF in seconds.",
]

function TypeWriter() {
  const [text, setText] = useState('')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    const current = phrases[phraseIndex]
    if (charIndex < current.length) {
      const t = setTimeout(() => {
        setText(prev => prev + current[charIndex])
        setCharIndex(c => c + 1)
      }, 50)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => {
        setText('')
        setCharIndex(0)
        setPhraseIndex(p => (p + 1) % phrases.length)
      }, 2200)
      return () => clearTimeout(t)
    }
  }, [charIndex, phraseIndex])

  return (
    <p className="text-zinc-400 text-lg font-mono text-center max-w-2xl mb-10 h-8">
      {text}<span className="animate-pulse text-sky-400">|</span>
    </p>
  )
}

function Hero({ companyConfig }) {
  const accentColor = companyConfig?.color || '#38bdf8'

  useEffect(() => {
    fetch('/api/track/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ company: companyConfig?.name || 'direct' })
    }).catch(() => {})
  }, [])

  return (
    <div id="hero" className="bg-black min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">

      <div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-10 top-20 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs font-mono px-4 py-2 rounded-full mb-6 border"
        style={{ backgroundColor: `${accentColor}18`, color: accentColor, borderColor: `${accentColor}40` }}
      >
        ›› free AI-powered resume matcher — no signup needed
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-white text-6xl md:text-8xl font-black text-center leading-none tracking-tighter mb-6"
      >
        Know your <span style={{ color: accentColor }}>match</span><br />before you apply.
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <TypeWriter />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex gap-4 flex-wrap justify-center"
      >
        <button
          onClick={() => document.getElementById('matcher')?.scrollIntoView({ behavior: 'smooth' })}
          className="font-bold text-lg px-8 py-4 rounded-2xl text-black cursor-pointer"
          style={{ backgroundColor: accentColor }}
        >
          Match My Resume →
        </button>
        <button
          onClick={() => document.getElementById('howitworks')?.scrollIntoView({ behavior: 'smooth' })}
          className="font-bold text-lg px-8 py-4 rounded-2xl text-white cursor-pointer bg-zinc-900 border border-zinc-700 hover:border-zinc-500 transition-colors"
        >
          How it works
        </button>
      </motion.div>

    </div>
  )
}

export default Hero