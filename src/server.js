require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
const client = require('../src/index');

app.get('/', (req, res) => {
  res.send('Bot siap masuk dashboard!');
});

app.use('/sayw', require('../src/routes/say-routes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot berjalan di port ${PORT}`));

