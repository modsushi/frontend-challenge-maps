require('dotenv').config();

const express = require('express');
const app = express();
const fetch = require('node-fetch');
const morgan = require('morgan');

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));
app.use(morgan('tiny'));
app.get("/-/ping", async (req, res) => {
  res.send("Yep, I'm Running");
});
app.get("/-/search", async (req, res) => {
  console.log('Hello ----');
  console.log(process.env);
  try {
    const urlParams = new URLSearchParams({ ...req.query });
    console.log(urlParams);
    const resp = await fetch(`https://api.yelp.com/v3/businesses/search?${urlParams}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${process.env.YELP_API_KEY}`
      }
    });
    const data = await resp.json();

    res.status(200).send(data);
  } catch (e) {
    console.log("ERROR: ", e);
  }
});
