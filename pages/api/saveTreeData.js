import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;
    const filePath = path.join(process.cwd(), "data", "treeData.json");
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(data);
    res.status(200).json({ message: "Dane zapisane pomyślnie" });
  } else {
    res.status(405).json({ message: "Metoda niedozwolona" });
  }
}
