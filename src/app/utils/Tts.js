export async function fetchDefaultSpeakerEmbedding() {
  try {
    const response = await fetch("http://localhost:3000/female.wav");
    const blob = await response.blob();
    const formData = new FormData();
    formData.append("wav_file", blob, "ref.wav");

    const speakerResponse = await fetch("api/cloneSpeaker", {
      method: "POST",
      body: formData,
    });
    return await speakerResponse.json();
  } catch (error) {
    console.error("Error fetching default speaker embedding:", error);
  }
}

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
        add_wav_header: true, // Upewnij się, że dźwięk ma poprawny nagłówek
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
        return reject(response.statusText); // Zwróć błąd, jeśli wystąpi problem z żądaniem
      }

      const reader = response.body.getReader();
      const audioChunks = [];
      let first = true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        if (first) {
          console.log("First audio chunk received");
          first = false;
        }

        if (value) {
          audioChunks.push(value); // Dodaj fragmenty do tablicy audio
        }
      }

      // Utwórz Blob z fragmentów audio z poprawnym typem MIME
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      console.log("Audio Blob:", audioBlob.type, audioBlob.size);

      // Odtwórz audio w przeglądarce
      playAudio(audioBlob, resolve);
    } catch (error) {
      console.error("Error in TTS stream:", error);
      reject(error); // Zwróć błąd, jeśli wystąpi problem w trakcie przetwarzania
    }
  });
}

function playAudio(audioBlob, resolve) {
  // Sprawdzenie, czy istnieje aktywne odtwarzanie i zatrzymanie poprzedniego
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0; // Resetuj czas odtwarzania
  }

  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);

  // Ustaw referencję do aktualnego dźwięku
  currentAudio = audio;

  audio.oncanplaythrough = () => {
    console.log("Audio is ready to play");
    audio.play();
  };

  audio.onended = () => {
    console.log("Audio finished playing");
    currentAudio = null; // Resetuj referencję po zakończeniu odtwarzania
    resolve(true); // Rozwiąż obietnicę po zakończeniu odtwarzania
  };

  audio.onerror = (e) => {
    console.error("Error playing audio:", e);
    resolve(false); // Rozwiąż obietnicę, nawet jeśli wystąpi błąd
  };
}
