import React, { useState, useEffect, useRef } from "react";

function KitchenOutput({ callOutInfo }) {
  const [number, setNumber] = useState("");
  const audioFiles = useRef({});
  const audioQueue = useRef([]);

  // Preload audio files
  useEffect(() => {
    const languages = ['en', 'zh'];
    languages.forEach(lang => {
      audioFiles.current[lang] = {};
      for (let i = 0; i <= 9; i++) {
        const audio = new Audio(`/audio/${lang}_${i}.mp3`);
        audioFiles.current[lang][i] = audio;
      }
      const pickupAudio = new Audio(`/audio/${lang}_pickup.mp3`);
      audioFiles.current[lang]['pickup'] = pickupAudio;
    });
  }, []);

  useEffect(() => {
    if (callOutInfo) {
      setNumber(callOutInfo.number);
      queueAudio(callOutInfo.number, callOutInfo.lang);
    }
  }, [callOutInfo]);

  const queueAudio = (num, lang) => {
    audioQueue.current = num.split("").map((digit) => ({ lang, key: parseInt(digit) }));
    audioQueue.current.push({ lang, key: 'pickup' });
    playNextAudio();
  };

  const playNextAudio = () => {
    if (audioQueue.current.length > 0) {
      const { lang, key } = audioQueue.current.shift();
      const audio = audioFiles.current[lang][key];
      audio.play();
      audio.onended = playNextAudio;
    }
  };

  return (
    <div className="mb-4">
      <div className="text-xl text-white">Last Called Number: {number}</div>
    </div>
  );
}

export default KitchenOutput;