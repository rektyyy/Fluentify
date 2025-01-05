export const config = {
  api: {
    bodyParser: false,
  },
};

import formidable from "formidable";
import fs from "fs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const form = formidable();
    const [fields, files] = await form.parse(req);

    if (!files.wav_file?.[0]) {
      return res.status(400).json({ error: "No wav_file provided" });
    }

    const formData = new FormData();
    formData.append(
      "wav_file",
      new Blob([fs.readFileSync(files.wav_file[0].filepath)]),
      files.wav_file[0].originalFilename
    );

    const response = await fetch("http://localhost:8000/clone_speaker", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Clone speaker error:", errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in clone_speaker:", error);
    return res.status(500).json({ error: error.message });
  }
}
