export default function RecordAudio() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        let chunks = [];

        mediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, {type: 'audio/wav'})
          //Wyslij dzwiek do Whispera
        }
      })
      .catch((err) =>
        console.error(`The following getUserMedia error occurred: ${err}`)
      );
  } else {
    console.error("getUserMedia not supported on your browser!");
  }
}


