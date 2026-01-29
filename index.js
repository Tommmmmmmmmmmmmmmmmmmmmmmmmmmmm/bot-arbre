require("dotenv").config();
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, AttachmentBuilder } = require("discord.js");

process.on("unhandledRejection", (e) => console.error("unhandledRejection:", e));
process.on("uncaughtException", (e) => console.error("uncaughtException:", e));

if (!process.env.DISCORD_TOKEN) {
  console.error("❌ DISCORD_TOKEN manquant (vérifie .env)");
  process.exit(1);
}
if (!process.env.CLIENT_ID) {
  console.error("❌ CLIENT_ID manquant (vérifie .env)");
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = [
  new SlashCommandBuilder()
    .setName("arbre")
    .setDescription("Affiche l'arbre généalogique")
    .toJSON()
];

(async () => {
  try {
    const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

    // ✅ Commande globale (pour tous les serveurs)
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log("✅ Commande /arbre enregistrée (globale).");
    await client.login(process.env.DISCORD_TOKEN);
  } catch (e) {
    console.error("❌ Erreur au démarrage:", e);
  }
})();

client.once("ready", () => console.log(`✅ Connecté : ${client.user.tag}`));

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== "arbre") return;

  const file = new AttachmentBuilder("./arbre.png");
  await interaction.reply({ files: [file] });
});
