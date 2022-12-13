const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");


const app = express();


app.use(cors());
app.use(express.json({limit: '50mb'}));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@cluster0.blm4ehx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

function sendInvitationEmail(user) {
    const { email } = user;

    const auth = {
        auth: {
          api_key: process.env.MAILGUN_API_KEY,
          domain: process.env.MAILGUN_API_DOMAIN 
        }
      }
      
      const transporter = nodemailer.createTransport(mg(auth));

    
      console.log('sending email', email)
    transporter.sendMail({
        from: "towhidul015@gmail.com", // verified sender email
        to: email || 'towhidul-35-2435@diu.edu.bd', // recipient email
        subject: 'Informing Invitaion', // Subject line
        text: "Hello world!", // plain text body
        html: `
        <h3>You application accepted and your
        application tracking no: 4567</h3>
        
        `, // html body
    }, function (error, info) {
        if (error) {
            console.log('Email send error', error);
        } else {
            console.log('Email sent: ' + info);
        }
    });
}



async function run() {
  try {
    const userCollection = client.db("SheraUser").collection("UserInfo");


    app.post('/userInfo', async(req, res) => {
        const user = req.body;
        const saved = await userCollection.insertOne(user);
        sendInvitationEmail(user)
        res.send(saved);

    })

  } finally {
  }
}
run().catch((err) => console.error(err));


app.get("/", async (req, res) => {
  res.send("server is booming");
});

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
