import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), "data", "userData.json");

  if (req.method === "GET") {
    try {
      if (!fs.existsSync(filePath)) {
        return res.status(404).json("No data found");
      }
      const fileContent = fs.readFileSync(filePath, "utf8");
      const data = JSON.parse(fileContent);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ message: "Error reading data" });
    }
  }

  if (req.method === "POST") {
    try {
      const data = req.body;
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return res.status(200).json({ message: "Data saved successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error saving data" });
    }
  }
  if (req.method === "DELETE") {
    try {
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "No data found to delete" });
      }
      fs.unlinkSync(filePath);
      return res.status(200).json({ message: "Data deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error deleting data" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
