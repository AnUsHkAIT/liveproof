import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

function Analytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/track/visits')
      .then(r => r.json())
      .then(d => {
        setData(d)
        setLoading(false)
      })
      .catch(() => {
        setData({ total: 0, byCompany: {}, recent: [] })
        setLoading(false)
      })
  }, [])

  const companyColors = {
    google: '#4285F4',
    amazon: '#FF9900',
    microsoft: '#00A4EF',
    meta: '#0866FF',
    netflix: '#E50914',
    direct: '#38bdf8',
  }

  return (
    <section id="analytics" className="bg-black py-28 px-6 border-t border-zinc-800">
      <div className="max-w-5xl mx-auto">

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-white text-4xl md:text-5xl font-black text-center tracking-tighter mb-4"
        >
          Live <span className="text-sky-400">Recruiter Activity</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-zinc-500 font-mono text-center mb-16"
        >
          ›› every visit tracked in real time
        </motion.p>

        {loading ? (
          <div className="flex justify-center">
            <div className="flex gap-2">
              <span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Total visits card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between"
            >
              <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mb-4">Total Profile Views</p>
              <p className="text-sky-400 text-7xl font-black tracking-tighter">{data?.total ?? 0}</p>
              <p className="text-zinc-600 font-mono text-xs mt-4">recruiters have opened this profile</p>
            </motion.div>

            {/* By company */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
            >
              <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mb-4">Views by Company</p>
              {data?.byCompany && Object.keys(data.byCompany).length > 0 ? (
                <div className="flex flex-col gap-3">
                  {Object.entries(data.byCompany).map(([company, count], i) => (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-zinc-300 font-mono text-sm capitalize">{company}</span>
                        <span className="text-zinc-400 font-mono text-xs">{count}</span>
                      </div>
                      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(count / data.total) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: companyColors[company] || '#38bdf8' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-24">
                  <p className="text-zinc-600 font-mono text-sm text-center">No company visits yet.</p>
                  <p className="text-zinc-700 font-mono text-xs text-center mt-2">Share /for/google to start tracking</p>
                </div>
              )}
            </motion.div>

            {/* Recent visits */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
            >
              <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mb-4">Recent Visits</p>
              {data?.recent && data.recent.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {[...data.recent].reverse().slice(0, 6).map((v, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-zinc-800 pb-2 last:border-0">
                      <span
                        className="font-mono text-xs capitalize px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${companyColors[v.company] || '#38bdf8'}20`,
                          color: companyColors[v.company] || '#38bdf8'
                        }}
                      >
                        {v.company}
                      </span>
                      <span className="text-zinc-600 font-mono text-xs">
                        {new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-24">
                  <p className="text-zinc-600 font-mono text-sm text-center">No visits logged yet.</p>
                  <p className="text-zinc-700 font-mono text-xs text-center mt-2">Visit this page to see it update</p>
                </div>
              )}
            </motion.div>

          </div>
        )}
      </div>
    </section>
  )
}

export default Analytics