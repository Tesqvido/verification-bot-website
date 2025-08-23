import axios from 'axios';

const WEBHOOK_URL = "https://discord.com/api/webhooks/1408778160644034631/6eS9eSuGmQc8VoCJXE1Yilb6a-4WZqSauidezmDp_YYGFyustSvybJRF9Dl2EaXPFHnv";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  // Body parsen
  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', async () => {
    const params = new URLSearchParams(body);
    const username = params.get('username');

    if (!username) return res.status(400).send('Kein Benutzername angegeben.');

    try {
      // Webhook senden
      await axios.post(WEBHOOK_URL, {
        content: `✅ Neuer User verifiziert: ${username}`
      });

      // Erfolgsseite anzeigen oder weiterleiten
      res.writeHead(302, { Location: '/verifiziert.html' });
      res.end();
    } catch (err) {
      console.error(err);
      res.status(500).send('Fehler beim Senden des Webhooks.');
    }
  });
}
