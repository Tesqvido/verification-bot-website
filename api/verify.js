import axios from 'axios';

const WEBHOOK_URL = "https://discord.com/api/webhooks/DEIN_WEBHOOK_URL";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', async () => {
    const params = new URLSearchParams(body);
    const username = params.get('username');
    const userid = params.get('userid');
    const role = params.get('role');

    if (!username || !userid || !role)
      return res.status(400).send('Alle Felder müssen ausgefüllt werden.');

    try {
      await axios.post(WEBHOOK_URL, {
        content: `✅ Neuer User verifiziert!`,
        embeds: [
          {
            title: 'Verifizierungsdaten',
            fields: [
              { name: 'Username', value: username, inline: true },
              { name: 'User ID', value: userid, inline: true },
              { name: 'Höchste Rolle', value: role, inline: true }
            ],
            color: 0x00ff00,
            timestamp: new Date()
          }
        ]
      });

      res.writeHead(302, { Location: '/verifiziert.html' });
      res.end();
    } catch (err) {
      console.error(err);
      res.status(500).send('Fehler beim Senden des Webhooks.');
    }
  });
}
