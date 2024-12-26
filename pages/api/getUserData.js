import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), "data", "userData.json");
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "User data file not found" });
  }
  const jsonData = fs.readFileSync(filePath);
  const data = JSON.parse(jsonData);
  res.status(200).json(data);
}
