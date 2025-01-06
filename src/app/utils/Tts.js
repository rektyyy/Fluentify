let currentAudio = null;

export async function streamTTS(text, speaker, language) {
  return new Promise(async (resolve, reject) => {
    try {
      const requestData = {
        text: text,
        language: language,
        gpt_cond_latent: speaker.gpt_cond_latent,
        speaker_embedding: speaker.speaker_embedding,
        stream_chunk_size: 512,
        add_wav_header: true,
      };

      const response = await fetch("api/ttsStream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        console.error("Error: ", response.statusText);
        return reject(response.statusText);
      }

      const reader = response.body.getReader();
      const audioChunks = [];
      let first = true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        if (first) {
          first = false;
        }

        if (value) {
          audioChunks.push(value);
        }
      }
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });

      // Odtwórz audio w przeglądarce
      playAudio(audioBlob, resolve);
    } catch (error) {
      console.error("Error in TTS stream:", error);
      reject(error);
    }
  });
}

function playAudio(audioBlob, resolve) {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);

  currentAudio = audio;

  audio.oncanplaythrough = () => {
    audio.play();
  };

  audio.onended = () => {
    currentAudio = null;
    resolve(true);
  };

  audio.onerror = (e) => {
    console.error("Error playing audio:", e);
    resolve(false);
  };
}
