import dynamic from "next/dynamic";

const SpeechToText = dynamic(() => import("./components/SpeechRecognition"), {
  ssr: false,
});

export default function Home() {
  return (
    <div>
      <h2>The new beginning</h2>
      <SpeechToText />
    </div>
  );
}
