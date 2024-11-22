'use client';

import { useState } from "react";

const publicVapidKey = "<public valid key>";

const Home = () => {
  const [number, setNumber] = useState("");

  const subscribeToNotifications = async () => {
    if (!("serviceWorker" in navigator)) {
      alert("Push notifications are not supported in your browser.");
      return;
    }

    // Register the service worker
    const registration = await navigator.serviceWorker.register("/service-worker.js");

    // Subscribe for push notifications
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: publicVapidKey,
    });

    // Send subscription to the backend
    await fetch("http://localhost:8000/subscribe", {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: { "Content-Type": "application/json" },
    });

    alert("Subscribed to notifications!");
  };

  const sendNotification = async () => {
    if (!number) {
      alert("Please enter a number.");
      return;
    }

    await fetch("http://localhost:8000/send-notification", {
      method: "POST",
      body: JSON.stringify({ number: parseInt(number, 10) }),
      headers: { "Content-Type": "application/json" },
    });

    setNumber("");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Push Notification with Number Squared</h1>
      <button onClick={subscribeToNotifications}>Subscribe to Notifications</button>
      <div style={{ marginTop: "20px" }}>
        <input
          type="number"
          placeholder="Enter a number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          style={{ padding: "10px", fontSize: "16px", marginRight: "10px" }}
        />
        <button
          onClick={sendNotification}
          style={{ padding: "10px 20px", fontSize: "16px" }}
        >
          Send Notification
        </button>
      </div>
    </div>
  );
};

export default Home;
