const express = require('express');
const router = express.Router();

module.exports  = (client) => {
  router.post('/sayw', (req, res) => {
    const { message } = req.body;

    const channel = client.channel.cache.get('1367187640973262898');
    if (!channel) {
      return res.status(404).send('Channel tidak ditemukan!');
    }


    channel.send(message)
      .then(() => res.send('Pesan sukses dikirim ke Discord!'))
      .catch(err => {
        console.error('Gagal kirim pesan:', err);
        res.status(500).send('Gagal kirim pesan');
      });
  });
  return router;
}