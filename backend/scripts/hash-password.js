const bcrypt = require('bcrypt');
const { Client } = require('pg');

async function hashAndUpdatePassword() {
  const password = 'admin123';
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  
  console.log('Generated hash:', hash);
  
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'shop_db',
    password: 'admin',
    port: 5432,
  });

  try {
    await client.connect();
    const query = 'UPDATE users SET password = $1 WHERE email = $2';
    const values = [hash, 'admin@example.com'];
    const res = await client.query(query, values);
    console.log('Password updated successfully');
  } catch (err) {
    console.error('Error updating password:', err);
  } finally {
    await client.end();
  }
}

hashAndUpdatePassword();
