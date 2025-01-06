import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  const filePath = path.join(process.cwd(), "data", "speakerData.json");

  if (req.method === "GET") {
    try {
      // Check if file exists
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf8");
        const data = JSON.parse(fileContent);
        return res.status(200).json(data);
      }
      return res.status(404).json({ message: "No speakers found" });
    } catch (error) {
      return res.status(500).json({ message: "Error fetching speakers" });
    }
  }

  if (req.method === "POST") {
    try {
      const data = req.body;
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return res.status(200).json({ message: "Speakers saved successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error saving speakers" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
