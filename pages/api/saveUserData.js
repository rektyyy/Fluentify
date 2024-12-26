import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;
    const filePath = path.join(process.cwd(), "data", "userData.json");
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(data);
    res.status(200).json({ message: "Data saved successfully" });
  } else {
    res.status(405).json({ message: "Forbidden method" });
  }
}
