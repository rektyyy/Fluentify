export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { speaker_embedding, gpt_cond_latent } = req.body;

    if (!speaker_embedding || !gpt_cond_latent) {
      return res.status(400).json({
        error: "Missing required speaker data",
      });
    }
    const ttsUrl = process.env.TTS_URL || "http://tts:80";
    const response = await fetch(`${ttsUrl}/tts_stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        speaker_embedding,
        gpt_cond_latent,
        text: req.body.text,
        language: req.body.language,
        add_wav_header: true,
        stream_chunk_size: "512",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("TTS stream error:", errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const audioData = await response.arrayBuffer();
    res.setHeader("Content-Type", "audio/wav");
    return res.send(Buffer.from(audioData));
  } catch (error) {
    console.error("Error in tts_stream:", error);
    return res.status(500).json({ error: error.message });
  }
}
