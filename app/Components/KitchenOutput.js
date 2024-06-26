import React, { useState, useEffect, useRef } from 'react';

function KitchenOutput() {
    const [number, setNumber] = useState("");
    const audioFiles = useRef([]);
    const audioQueue = useRef([]);

    // Preload audio files
    useEffect(() => {
        for (let i = 0; i <= 9; i++) {
            const audio = new Audio(`/audio/0${i}.mp3`);
            audioFiles.current[i] = audio;
        }
    }, []);

    useEffect(() => {
        const playNextAudio = () => {
            if (audioQueue.current.length > 0) {
                const audio = audioFiles.current[audioQueue.current.shift()];
                audio.play();
                audio.onended = playNextAudio;
            }
        };

        if (audioQueue.current.length === 3) { // Start playing when all three are queued
            playNextAudio();
        }
    }, [number]); // Triggered when number changes

    const handleGenerateNumber = () => {
        const newNumber = Math.floor(100 + Math.random() * 900).toString();  // Generates a number between 100 and 999
        setNumber(newNumber);
        audioQueue.current = newNumber.split('').map(digit => parseInt(digit));
    };

    return (
        <div>
            <button onClick={handleGenerateNumber}>Generate Number</button>
            <div className='text-xl text-white'>Number: {number}</div>
        </div>
    );
}

export default KitchenOutput;