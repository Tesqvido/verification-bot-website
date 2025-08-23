import axios from 'axios';
import { WebhookClient, EmbedBuilder } from 'discord.js';

const CLIENT_ID = "1408754388968935424";
const CLIENT_SECRET = "JcPHRNzoeDR-YHFOALMcHxGhANSYUtUv";
const REDIRECT_URI = "https://discord-verification-1391178545744576602.vercel.app/api/callback";
const WEBHOOK_URL = "https://discord.com/api/webhooks/1408778160644034631/6eS9eSuGmQc8VoCJXE1Yilb6a-4WZqSauidezmDp_YYGFyustSvybJRF9Dl2EaXPFHnv";

const webhookClient = new WebhookClient({ url: WEBHOOK_URL });

export default async function handler(req, res) {
  const { code } = req.query;
  if (!code) return res.status(400).send('Fehler: Kein Code erhalten.');

  try {
    // Token anfordern
    const params = new URLSearchParams();
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', REDIRECT_URI);
    params.append('scope', 'identify');

    const tokenResponse = await axios.post(
      'https://discord.com/api/oauth2/token',
      params.toString(), // <-- unbedingt toString() verwenden!
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' } }
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
    console.error(err.response?.data || err);
    res.status(500).send('Fehler beim Verifizieren.');
  }
}
