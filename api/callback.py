import requests
from flask import Request

CLIENT_ID = "1408754388968935424"
CLIENT_SECRET = "JcPHRNzoeDR-YHFOALMcHxGhANSYUtUv"
REDIRECT_URI = "https://verification-bot.vercel.app/verify/callback"
BOT_API_URL = "http://verification-bot.vercel.app/verify"

def handler(request: Request):
    code = request.args.get("code")
    if not code:
        return "No code provided", 400

    # Code → Token
    data = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI,
        "scope": "identify",
    }
    token_response = requests.post("https://discord.com/api/oauth2/token", data=data).json()

    # Userinfo holen
    headers = {"Authorization": f"Bearer {token_response['access_token']}"}
    user_data = requests.get("https://discord.com/api/users/@me", headers=headers).json()

    # An Bot-API schicken
    requests.post(BOT_API_URL, json={
        "user_id": user_data["id"],
        "username": user_data["username"]
    })

    return f"✅ Erfolgreich verifiziert als {user_data['username']}"
