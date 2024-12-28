import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), "data", "treeData.json");

  if (req.method === "GET") {
    try {
      if (!fs.existsSync(filePath)) {
        return res.status(200).json(null);
      }
      const fileContent = fs.readFileSync(filePath, "utf8");
      const data = JSON.parse(fileContent);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ message: "Error reading tree data" });
    }
  }

  if (req.method === "POST") {
    try {
      const data = req.body;
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return res.status(200).json({ message: "Tree data saved successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error saving tree data" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
