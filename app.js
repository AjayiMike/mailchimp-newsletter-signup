
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const private = require("./private.js");


const emailRegexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const {apiKey, listId} = private;
let userData = {};
const url =` https://us2.api.mailchimp.com/3.0/lists/${listId}/members`;

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", (req, res) => {

    const {firstName, lastName, email, phoneNumber} = req.body;
    
    if(firstName.length > 2 && lastName.length >2 && emailRegexp.test(email) && (phoneNumber.length > 10 && phoneNumber.length < 16)) {

        userData = {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName,
                PHONE: phoneNumber
            }
        }

        const jsonUserData = JSON.stringify(userData)
        JSON.parse
        const options = {
            method: "POST",
            auth: `sir adek:${apiKey}`
        }

        const request = https.request(url, options, response => {
            response.on("data", data => {
                    console.log(JSON.parse(data));
                    res.sendFile(__dirname + "/success.html");
            }).on("error", error => {
                console.log(error);
                res.sendFile(__dirname + "/error.html");
            })
        })

        request.write(jsonUserData)
        request.end()
    }

        
    else {
        res.sendFile(__dirname + "/error.html");
    }
})


app.listen(4000, () => {
    console.log("server started on port 4000");
})