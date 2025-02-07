const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

// Define an endpoint to fetch quiz data
app.get("/api/quiz", async (req, res) => {
  try {
    // Fetch data from the external API
    const response = await axios.get("https://api.jsonserve.com/Uw5CrX");
    // Send the data to the client
    res.json(response.data);
  } catch (error) {
    // Handle error
    console.error("Error fetching quiz data:", error);
    res.status(500).json({ error: "Error fetching quiz data" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
