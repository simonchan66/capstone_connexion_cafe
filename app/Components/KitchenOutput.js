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
        // Preload the 'pickup_eng.mp3'
        const pickupAudio = new Audio('/audio/pickup_eng.mp3');
        audioFiles.current['pickup'] = pickupAudio;  // Store it with a key for easy access
    }, []);

    useEffect(() => {
        const playNextAudio = () => {
            if (audioQueue.current.length > 0) {
                const audioKey = audioQueue.current.shift();  // This could now be a digit or 'pickup'
                const audio = audioFiles.current[audioKey];
                audio.play();
                audio.onended = playNextAudio;
            }
        };

        if (audioQueue.current.length === 4) { // Start playing when all four are queued (including 'pickup')
            playNextAudio();
        }
    }, [number]); // Triggered when number changes

    const handleGenerateNumber = () => {
        const newNumber = Math.floor(100 + Math.random() * 900).toString();  // Generates a number between 100 and 999
        setNumber(newNumber);
        audioQueue.current = newNumber.split('').map(digit => parseInt(digit));
        audioQueue.current.push('pickup');  // Add 'pickup' to the queue after the numbers
    };

    return (
        <div>
            <button onClick={handleGenerateNumber}>Generate Number</button>
            <div className='text-xl text-white'>Number: {number}</div>
        </div>
    );
}

export default KitchenOutput;