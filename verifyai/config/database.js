const { Pool } = require('pg');

const pool = new Pool({
  user: 'neondb_owner',
  password: 'npg_duMY6ZPUeLf5',
  host: 'ep-little-frost-a45rs6bg-pooler.us-east-1.aws.neon.tech',
  port: 5432,
  database: 'vai',
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
});

pool.connect()
  .then(client => {
    console.log('✅ Connected to Neon PostgreSQL successfully!');
    client.release();
  })
  .catch(err => console.error('❌ Database connection error:', err));

module.exports = pool;
