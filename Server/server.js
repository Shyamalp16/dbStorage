const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config();
const fileModel = require('./Files')

const Discord = require('discord.js');
const { GatewayIntentBits, AttachmentBuilder, MessageAttachment, Attachment } = require('discord.js')
const discordClient = new Discord.Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
],
  restRequestTimeout: 60000 // change the timeout to 1 minute
});
const { EmbedBuilder } = require('discord.js');
token = process.env.TOKEN;

const app = express();
const port = 3001;
app.use(cors());

// MongoUri and Initialize MongoClient
// const uri = "mongodb+srv://patelshyamal016:tBouJB5S7pSJM2rB@cluster0.uuijgcf.mongodb.net/?retryWrites=true&w=majority";
const uri = process.env.URI;
const client = new MongoClient(uri, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
})



const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage });

app.post('/upload', upload.single('file'), async (req, res) => {
  const { file } = req;

  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  const fileSize = file.size;
  const chunkSize = 20 * 1024 * 1024; // 25MB chunks

//   if (fileSize > chunkSize) {
//     return res.status(400).send('File size exceeds the maximum allowed size (25MB).');
//   }

  // Convert the file buffer to binary data
  const binaryData = file.buffer;

  // Split the binary data into 25MB chunks
  const chunks = [];
  for (let i = 0; i < binaryData.length; i += chunkSize) {
    chunks.push(binaryData.slice(i, i + chunkSize));
  }

  // Save the chunks to the server
  const fileDirectory = 'uploads/';
  const fileName = file.originalname;

  if (!fs.existsSync(fileDirectory)) {
    fs.mkdirSync(fileDirectory);
  }

  let totalParts;
  let totalFileParts;
  const channel = discordClient.channels.cache.get('1050234480880795701')
  
  chunks.forEach( async (chunk, index) => {
    const chunkFileName = `${fileName}_part${index + 1}.bin`;

    const filePath = path.join(fileDirectory, chunkFileName);
    totalFileParts = index+1;
    fs.writeFileSync(filePath, chunk);


    //Make a new attachment
    const attachment = new AttachmentBuilder(chunk, {name: chunkFileName});
  

    const sentMessage = await channel.send({files: [attachment]})
    .then(() => console.log("File sent successfully"))
    .catch(err => console.error("Error sending file:", err))
    
  });
  
  // Save refs to mongoDB
  try{
    const db = client.db('dbStorage');
    const filesCollection = db.collection('files');

    const docToInsert = {
        fileName: file.originalname,
        totalParts: totalFileParts,
    };

    const result = await filesCollection.insertOne(docToInsert);
    console.log('Document inserted with ID:', result.insertedId);
  }catch(error){
    console.error('Error inserting document:', error);
  }finally{
    // await client.close();
  }
  
  return res.json({ message: 'File uploaded successfully', filename: fileName });
});

app.get('/getFiles', async (req, res) => {
  // Hit the /getFiles endpoint and find all the data, post it to the end point
  const db = client.db('dbStorage')
  const files = db.collection('files');

  files.find({}).toArray((err, docs) => {
    if(err){
      console.error("ERROR FETCHING");
    }else{
      res.json({files: docs})
    }
  })
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


client.connect(async (err) => {
    if(err){
        console.error('Error connecting to MongoDB Database', err)
        return
    }
    console.log('Connected to MongoDB Database');
  })

discordClient.once('ready', () => { 
  console.log(`Logged in as ${discordClient.user.tag}`);
});

discordClient.login(token);