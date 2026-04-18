const Database = require('better-sqlite3')
const path = require('path')

const db = new Database(path.join(__dirname, 'liveproof.db'))

db.exec(`
  CREATE TABLE IF NOT EXISTS visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company TEXT DEFAULT 'direct',
    timestamp TEXT DEFAULT (datetime('now')),
    ip TEXT DEFAULT ''
  )
`)

module.exports = db