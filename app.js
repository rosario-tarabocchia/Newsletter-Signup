require('dotenv').config();
const express = require("express");
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing");

const app = express();

const mailKey = process.env.MAIL_KEY;
const mailServerKey = process.env.SERVER_KEY;





// app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
client.setConfig({apiKey: mailKey, server: mailServerKey});

app.get("/", function(req, res){

  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  console.log(firstName, lastName, email);

  const subscriber = {
    firstName: firstName,
    lastName: lastName,
    email: email,
  };


  const uniqueID = process.env.CLIENT_KEY;

  const run = async() => {
        const response = await client.lists.addListMember(uniqueID, {
            email_address: subscriber.email,
            status: "subscribed",
            merge_fields: {
                FNAME: subscriber.firstName,
                LNAME: subscriber.lastName,

            }


        });
      res.sendFile(__dirname + "/Success.html");
        console.log(response);
  };

  run().catch(e => res.sendFile(__dirname + "/Failure.html"));

});












app.listen(process.env.PORT || 3000, function(){

  console.log("The server is running on 3000.");

})
