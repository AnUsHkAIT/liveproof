import { motion } from 'framer-motion'

const steps = [
  {
    number: "01",
    title: "Paste your skills or upload resume",
    desc: "Type your skills manually or paste your resume text. No account needed, no signup, nothing stored.",
  },
  {
    number: "02",
    title: "Paste the job description",
    desc: "Copy any job description from LinkedIn, Indeed, company websites — anywhere. Paste it in.",
  },
  {
    number: "03",
    title: "AI scores your match instantly",
    desc: "Claude AI compares your skills against the JD and gives you a match percentage, what you have, and what you're missing.",
  },
  {
    number: "04",
    title: "Download your tailored resume PDF",
    desc: "Get a clean one-page resume PDF generated on the spot, customized to highlight your most relevant skills for that exact role.",
  },
]

function HowItWorks() {
  return (
    <section id="howitworks" className="bg-zinc-950 py-28 px-6 border-t border-zinc-800">
      <div className="max-w-4xl mx-auto">

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-white text-4xl md:text-5xl font-black text-center tracking-tighter mb-4"
        >
          Simple as <span className="text-sky-400">four steps</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-zinc-500 font-mono text-center mb-16"
        >
          ›› no fluff. paste in, get results, download, apply.
        </motion.p>

        <div className="flex flex-col gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-6 items-start bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
            >
              <span className="text-sky-400 font-black text-3xl tracking-tighter shrink-0">{s.number}</span>
              <div>
                <h3 className="text-white font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-zinc-500 font-mono text-sm leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default HowItWorks