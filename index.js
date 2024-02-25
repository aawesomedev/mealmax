import { writeJsonFileSync } from 'write-json-file';
import { loadJsonFileSync} from 'load-json-file';
import { Client, EmbedBuilder} from 'discord.js';
const client = new Client({ intents: 3276799 });
const PREFIX = "mx.";
import fs from 'fs';

// "Database"
let globals = loadJsonFileSync('globals.json');


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', message => {

    // Ignore messages from bots
    if(message.author.bot) return;

    if (message.channel.id === globals['counting-channel']) {
        countingChannel(message)
    }

    // Command handling under this line
    if (!message.content.startsWith(PREFIX)) return;

    // Remove the prefix and split the message into arguments
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // Handle each command
    switch (command) {
        case "scc":
            const embed = new EmbedBuilder();
            embed.setTitle("Setting Counting Channel");
            embed.setDescription("This channel is now the counting channel.");
            embed.setColor("#ffffff");

            globals['counting-channel'] = message.channel.id;
            saveUpdateGlobals();

            message.channel.send({ embeds: [embed] });
            break;
        default:
            break;
    }
});

function saveUpdateGlobals(){
    writeJsonFileSync('globals.json', globals);
    globals = loadJsonFileSync('globals.json');
}

function countingChannel(message){

    // Check if the message begins with a number
    const match = message.content.match(/^[0-9]+/);
    if (!match) return;

    const number = parseInt(match[0], 10);

    if(globals['current-count'] + 1 === number){

        globals['current-count'] = number;
        saveUpdateGlobals();
        message.react('✅');

    } else if (globals['current-count'] === number){

        const embed = new EmbedBuilder();
        embed.setTitle("Number Repeated");
        embed.setDescription("You can't repeat the same number. Next number is " + (number + 1));
        embed.setColor("#da4545");

        message.reply({ embeds: [embed] });

        return;

    } else {

        const embed = new EmbedBuilder();
        embed.setTitle("You Fucked Up Big Time");
        embed.setDescription("Reset count. Number starts at 1.");
        embed.setColor("#da4545");

        message.reply({ embeds: [embed] });

        globals['current-count'] = 0;
        saveUpdateGlobals();

    }
}

function readFileSyncAsString(filePath) {
    try {
        const data = fs.readFileSync(filePath, { encoding: 'utf8' });
        return data; // process the data
    } catch (error) {
        console.error("Failed to read file:", error);
        return null
    }
}

client.login(readFileSyncAsString('./token.txt')).then(r => console.log(r));