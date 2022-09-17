const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const { request } = require("http");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
// api key - 398e107539069ed94646b47b7cf83fdd-us9
// audience id - e534e802be
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  console.log(firstName + " " + lastName + " " + email);

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);

  const url = "https://us9.api.mailchimp.com/3.0/lists/e534e802be";
  const options = {
    method: "POST",
    auth: "pscon:398e107539069ed94646b47b7cf83fdd-us9",
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/sucess.html");
    } else {
      res.sendFile(__dirname + "/fail.html");
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  console.log(res.statusCode);

  request.write(jsonData);

  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(port, () => {
  console.log("Express server listening on port " + port);
});
