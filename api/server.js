const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const expressFileupload = require('express-fileupload');
const { exec } = require('child_process');
const bcrypt = require('bcrypt');
const session = require('express-session');

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'face_db'
  }
});

const port = 7000;

// Middleware setup
app.use(cors());
app.use(cors({
  origin: 'http://dev.krualongkorn.com:3000', // ปรับให้ตรงกับที่อยู่ของ frontend
  credentials: true
}));

app.use(bodyParser.json());
app.use(expressFileupload());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.set('view engine', 'ejs');

// Routes

// Get all records from date_storage_room
app.get('/date_storage', async (req, res) => {
  try {
    let result = await knex.select('*').from('date_storage_room');
    res.send({ ok: 1, check_username: result });
  } catch (error) {
    res.status(500).send({ ok: 0, error: error.message });
  }
});

// Insert a new record into date_storage_room
app.post('/insert_date_storage', async (req, res) => {
  let data = req.body;
  console.log('Insert', data);
  try {
    let ids = await knex('date_storage_room').insert({
      month: data.month,
      week: data.week,
      join_start: data.join_start,
      join_end: data.join_end,
      status: data.status
    });
    res.send({ ok: 1, id: ids[0] });
  } catch (error) {
    res.send({ ok: 0, error: error.message });
  }
});

// Update a record in date_storage_room
app.post('/update_date_storage', async (req, res) => {
  let data = req.body;
  console.log('Update', data);
  try {
    await knex('date_storage_room')
      .update({
        month: data.month,
        week: data.week,
        join_start: data.join_start,
        join_end: data.join_end,
        status: data.status
      })
      .where({ id: data.id });
    res.send({ ok: 1 });
  } catch (error) {
    res.send({ ok: 0, error: error.message });
  }
});

// Get all staff records
app.get('/staffs', async (req, res) => {
  try {
    let result = await knex.select('*').from('users');
    res.send({ ok: 1, staffs: result });
  } catch (error) {
    res.status(500).send({ ok: 0, error: error.message });
  }
});

// Get all check-in records
app.get('/check_in', async (req, res) => {
  try {
    let result = await knex.select('*').from('check_in');
    res.send({ ok: 1, check_in: result });
  } catch (error) {
    res.status(500).send({ ok: 0, error: error.message });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login', username, password);
  try {
    // ค้นหาผู้ใช้ในฐานข้อมูล
    const user = await knex('users').where({ username }).first();
    if (user) {
      // เปรียบเทียบรหัสผ่านที่ป้อนเข้ามากับรหัสผ่านที่ถูกแฮช
      const crypto = require('crypto');
      // สร้าง MD5 hash
      const HashedPassword = crypto.createHash('md5').update(password).digest('hex');

      if (HashedPassword === user.password) {
        // หากรหัสผ่านถูกต้อง ส่งกลับ token หรือข้อมูลที่จำเป็น
        res.status(200).json({ message: 'Login successful', token: user.id });
      } else {
        res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
      }
    } else {
      res.status(401).json({ message: 'ชื่อผู้ใช้ไม่ถูกต้อง' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Logout user
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send({ ok: 0, error: 'Logout failed' });
    }
    res.send({ ok: 1, message: 'Logged out successfully' });
  });
});

// Update user information
app.post('/update_user', async (req, res) => {
  let data = req.body;
  console.log('Update', data);
  try {
    let updateData = {
      username: data.username,
      email: data.email,
      picture: data.picture
    };
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }
    let ids = await knex('users').update(updateData).where({ id: data.id });
    res.send({ ok: 1, id: ids });
  } catch (error) {
    res.send({ ok: 0, error: error.message });
  }
});

// Delete user
app.post('/delete_user', async (req, res) => {
  let id = req.query.id;
  console.log('Delete', id);
  try {
    let ids = await knex('users').delete().where({ id: id });
    res.send({ ok: 1, id: ids });
  } catch (error) {
    res.send({ ok: 0, error: error.message });
  }
});

// Search user by ID
app.post('/search_user', async (req, res) => {
  let data = req.body;
  console.log('Search', data);
  try {
    let result = await knex.select('*').from('users').where({ id: data.id });
    res.send({ ok: 1, user: result });
  } catch (error) {
    res.send({ ok: 0, error: error.message });
  }
});

// Route to run Python script
app.post('/run-checkin', (req, res) => {
  const { token } = req.body;
  
  console.log('Run', token);

  if (!token) {
    return res.status(400).send({ ok: 0, error: 'Token is required' });
  }

  // Run the Python script with the token as an argument
  const command = `python3 python/detectface_1.py ${token}`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error.message}`);
      return res.status(500).send({ ok: 0, error: 'Error running Python script' });
    }
    
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).send({ ok: 0, error: 'Python script error', details: stderr });
    }

    // If everything is successful, send the output of the script
    res.send({ ok: 1, output: stdout });
  });
});

app.post('/run-register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send({ ok: 0, error: 'username and staffId are required' });
  }

  // Pass username and staffId as command-line arguments to the Python script
  const command = `python3 python/register_1.py ${username} ${email} ${password}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send({ ok: 0, error: 'Error running Python script' });
    }
    res.send({ ok: 1, output: stdout });
  });
});

app.post('/delete', async (req, res) => {
  let id = req.query.id;  // Get the ID from the query parameters
  console.log('Delete', id);

  try {
    // Start a transaction to ensure both deletions are executed atomically
    await knex.transaction(async (trx) => {
      // Delete from the `check_in` table
      await trx('check_in').delete().where({ staffId: id });
    });

    res.send({ ok: 1 });
  } catch (error) {
    res.send({ ok: 0, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
