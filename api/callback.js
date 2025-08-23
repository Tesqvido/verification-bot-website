import axios from 'axios';
import { WebhookClient, EmbedBuilder } from 'discord.js';

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

const webhookClient = new WebhookClient({ url: WEBHOOK_URL });

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) return res.status(400).send('Fehler: Kein Code erhalten.');

  try {
    // Token anfordern
    const tokenResponse = await axios.post(
      'https://discord.com/api/oauth2/token',
      new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        scope: 'identify',
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const accessToken = tokenResponse.data.access_token;

    // Userdaten abrufen
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const user = userResponse.data;

    // Embed senden
    const embed = new EmbedBuilder()
      .setTitle('Neuer User verifiziert!')
      .setDescription(`${user.username}#${user.discriminator} hat sich verifiziert.`)
      .setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`)
      .setColor(0x00ff00)
      .setTimestamp();

    await webhookClient.send({ embeds: [embed] });

    res.status(200).send(`Hallo ${user.username}, du bist verifiziert! ✅`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Fehler beim Verifizieren.');
  }
}
