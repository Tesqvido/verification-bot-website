import discord
from discord.ext import commands
from flask import Flask, request
import threading

TOKEN = "MTQwODc1NDM4ODk2ODkzNTQyNA.GdclMe.aA-8n_6CCFTchJU_2FrLJyXO1w5R3Zsw7Li6io"
GUILD_ID = 1391178545744576602
ROLE_NAME = "verify"
CHANNEL_ID = 1408771982727712810

intents = discord.Intents.default()
intents.members = True
bot = commands.Bot(command_prefix="!", intents=intents)

app = Flask("verify_api")

@app.route("/verify", methods=["POST"])
def verify_user():
    data = request.json
    user_id = int(data["user_id"])
    username = data["username"]

    guild = bot.get_guild(GUILD_ID)
    member = guild.get_member(user_id)
    role = discord.utils.get(guild.roles, name=ROLE_NAME)

    if member and role:
        async def task():
            await member.add_roles(role)
            channel = guild.get_channel(CHANNEL_ID)
            embed = discord.Embed(
                title="✅ Verifiziert!",
                description=f"{member.mention} wurde verifiziert.",
                color=discord.Color.green(),
            )
            await channel.send(embed=embed)

        bot.loop.create_task(task())
    return {"status": "ok"}

def run_flask():
    app.run(host="0.0.0.0", port=8080)

@bot.event
async def on_ready():
    print(f"✅ Bot {bot.user} ist online!")

threading.Thread(target=run_flask).start()
bot.run(TOKEN)
