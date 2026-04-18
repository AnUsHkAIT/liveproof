import { motion } from 'framer-motion'
import { useState } from 'react'

function Navbar({ companyConfig }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const accentColor = companyConfig?.color || '#38bdf8'

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b border-zinc-800 bg-black/80 backdrop-blur-md"
    >
      <span className="text-white font-black text-xl tracking-tighter cursor-pointer" onClick={() => scrollTo('hero')}>
        Live<span style={{ color: accentColor }}>Proof</span>
      </span>

      <div className="hidden md:flex items-center gap-6">
        <button onClick={() => scrollTo('howitworks')} className="text-zinc-400 hover:text-white text-sm font-mono transition-colors">How it works</button>
        <button onClick={() => scrollTo('matcher')} className="text-zinc-400 hover:text-white text-sm font-mono transition-colors">Try it</button>
        <button onClick={() => scrollTo('analytics')} className="text-zinc-400 hover:text-white text-sm font-mono transition-colors">Analytics</button>
        <button
          onClick={() => scrollTo('matcher')}
          className="text-sm font-bold px-4 py-2 rounded-xl text-black transition-colors"
          style={{ backgroundColor: accentColor }}
        >
          Match My Resume →
        </button>
      </div>

      <button className="md:hidden text-white text-xl" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? '✕' : '☰'}
      </button>

      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 bg-black border-b border-zinc-800 flex flex-col px-8 py-6 gap-4 md:hidden"
        >
          <button onClick={() => scrollTo('howitworks')} className="text-zinc-400 text-sm font-mono text-left">How it works</button>
          <button onClick={() => scrollTo('matcher')} className="text-zinc-400 text-sm font-mono text-left">Try it</button>
          <button onClick={() => scrollTo('analytics')} className="text-zinc-400 text-sm font-mono text-left">Analytics</button>
          <button
            onClick={() => scrollTo('matcher')}
            className="text-sm font-bold px-4 py-2 rounded-xl w-fit text-black"
            style={{ backgroundColor: accentColor }}
          >
            Match My Resume →
          </button>
        </motion.div>
      )}
    </motion.nav>
  )
}

export default Navbar