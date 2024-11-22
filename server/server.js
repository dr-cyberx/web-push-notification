const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const webpush = require("web-push");

const app = express();
const port = 8000;

const publicVapidKey =
  "BOyS2KnwzhCG2RlUmH0hOkA6uZerTdXJd7o57LMpBVrQMXDH9KhxAHNHw4BXP7gfKAkAnhp5qHPRDWJ4aZ3zO4o"; ///
const privateVapidKey = "5tPqRw8vCf3ugoiNxASz_P7g8JKfkxzFjKLoiFxjdOw"; ///

webpush.setVapidDetails(
  "mailto:vishal.kumar@aeccglobal.com",
  publicVapidKey,
  privateVapidKey
);

let subscriptions = []; // In-memory subscriptions

app.use(cors());

app.use(bodyParser.json());

// Save subscription endpoint
app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({ message: "Subscription saved!" });
});

// Send push notification endpoint
app.post("/send-notification", (req, res) => {
  const { number } = req.body;
  const squared = number * number;

  const payload = JSON.stringify({
    title: "Number Squared",
    body: `The square of ${number} is ${squared}.`,
  });

  // --create multiple push notifications---
  // subscriptions.forEach((subscription) => {
  //   webpush
  //     .sendNotification(subscription, payload)
  //     .catch((err) => console.error(err));
  // });

  // solution to restrict multiple push notifications
  webpush
    .sendNotification(subscriptions[0], payload)
    .catch((err) => console.error(err));

  res.status(200).json({ message: "Notification sent!" });
});

app.listen(port, () => {
  console.log("Server 🚀 is running on port " + port);
});

// Public Key: BOyS2KnwzhCG2RlUmH0hOkA6uZerTdXJd7o57LMpBVrQMXDH9KhxAHNHw4BXP7gfKAkAnhp5qHPRDWJ4aZ3zO4o
// Private Key: 5tPqRw8vCf3ugoiNxASz_P7g8JKfkxzFjKLoiFxjdOw
