import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.post("/check-license", (req, res) => {
  const { key } = req.body;

  if (key === "FADY-123") {
    return res.json({ valid: true });
  }

  res.json({ valid: false });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});