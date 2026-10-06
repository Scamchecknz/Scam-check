import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("."));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/check", (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== "string") {
    return res.status(400).json({
      error: "Please provide a message or link to check."
    });
  }

  const content = text.toLowerCase();
  const reasons = [];
  let score = 0;

  const warningSigns = [
    ["urgent", "Uses urgent language"],
    ["act now", "Pressures you to act quickly"],
    ["verify your account", "Asks you to verify an account"],
    ["password", "Mentions passwords or login information"],
    ["bank account", "Mentions banking information"],
    ["gift card", "Mentions gift cards"],
    ["prize", "Claims you may have won a prize"],
    ["winner", "Claims you are a winner"],
    ["click here", "Encourages you to click a link"],
    ["crypto", "Mentions cryptocurrency"],
    ["bitcoin", "Mentions Bitcoin"]
  ];

  for (const [phrase, reason] of warningSigns) {
    if (content.includes(phrase)) {
      score++;
      reasons.push(reason);
    }
  }

  if (/https?:\/\//i.test(text)) {
    score++;
    reasons.push("Contains a web link");
  }

  let riskLevel = "Unclear";

  if (score === 0) riskLevel = "Low Risk";
  if (score >= 2) riskLevel = "Suspicious";
  if (score >= 4) riskLevel = "High Risk";

  res.json({
    riskLevel,
    score,
    reasons,
    message:
      reasons.length > 0
        ? "Warning signs were detected. Check carefully before taking action."
        : "No obvious warning signs were detected by the current checks."
  });
});

app.listen(PORT, () => {
  console.log(`Scam Check NZ running on port ${PORT}`);
});
