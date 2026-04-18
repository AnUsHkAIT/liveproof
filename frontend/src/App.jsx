import { useState, useEffect } from 'react'
import { companies } from './companies'
import Navbar from './Navbar'
import Hero from './Hero'
import HowItWorks from './HowItWorks'
import Matcher from './Matcher'
import Analytics from './Analytics'
import Footer from './Footer'

function App({ companySlug }) {
  const [loading, setLoading] = useState(true)
  const companyConfig = companySlug ? (companies[companySlug] || null) : null

  useEffect(() => {
    document.title = companyConfig
      ? `LiveProof — Built for ${companyConfig.name}`
      : 'LiveProof — Match Your Resume to Any Job'
  }, [companyConfig])

  useEffect(() => {
    setTimeout(() => setLoading(false), 1800)
  }, [])

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white font-black text-4xl tracking-tighter mb-4">
            Live<span className="text-sky-400">Proof</span>
          </p>
          <p className="text-zinc-500 font-mono text-sm mb-6">AI-powered resume matcher</p>
          <div className="flex gap-2 justify-center">
            <span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar companyConfig={companyConfig} />
      <Hero companyConfig={companyConfig} />
      <HowItWorks />
      <Matcher companyConfig={companyConfig} />
      <Analytics />
      <Footer />
    </div>
  )
}

export default App