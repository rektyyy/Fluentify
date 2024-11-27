import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), "data", "treeData.json");
  const jsonData = fs.readFileSync(filePath);
  const data = JSON.parse(jsonData);
  res.status(200).json(data);
}
