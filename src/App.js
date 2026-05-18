import React, { useState, useEffect, useRef, useCallback } from 'react';
import songs from './songs';
import Details from './Details';
import Controls from './Controls';
import './App.css';

function App() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [trackProgress, setTrackProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioEl = useRef(null);
  const intervalRef = useRef(null);

  // 1. Move SkipTrack to the top so other functions can reference it safely
  const SkipTrack = useCallback((forwards = true) => {
    if (forwards) {
      setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % songs.length);
    } else {
      setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + songs.length) % songs.length);
    }
  }, []); // Empty array because it relies on functional state updates (prevIndex)

  // 2. Define startTimer BEFORE the useEffect that calls it
  const startTimer = useCallback(() => {
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (audioEl.current.ended) {
        SkipTrack(true);
      } else {
        setTrackProgress(audioEl.current.currentTime);
      }
    }, 1000);
  }, [SkipTrack]); // Added SkipTrack here since it's called inside

  // 3. Play / Pause handling effect moves below startTimer
  useEffect(() => {
    if (isPlaying) {
      audioEl.current.play().catch((err) => console.log("Playback interrupted:", err));
      startTimer();
    } else {
      clearInterval(intervalRef.current);
      audioEl.current.pause();
    }
  }, [isPlaying, currentTrackIndex, startTimer]); 

  // Volume handling
  useEffect(() => {
    if (audioEl.current) {
      audioEl.current.volume = volume;
    }
  }, [volume]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const onTrackLoaded = () => {
    setDuration(audioEl.current.duration);
    setTrackProgress(0);
  };

  const onScrub = (value) => {
    clearInterval(intervalRef.current);
    audioEl.current.currentTime = value;
    setTrackProgress(audioEl.current.currentTime);
  };

  const onScrubEnd = () => {
    if (isPlaying) {
      startTimer();
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="app-container">
      <audio 
        src={songs[currentTrackIndex].src} 
        ref={audioEl}
        onLoadedMetadata={onTrackLoaded}
      ></audio>
      
      <div className="music-player-card">
        <Details track={songs[currentTrackIndex]} isPlaying={isPlaying} />
        
        {/* --- PROGRESS BAR --- */}
        <div className="progress-container">
          <span className="time">{formatTime(trackProgress)}</span>
          <input 
            type="range"
            value={trackProgress}
            step="1"
            min="0"
            max={duration ? duration : 0}
            className="progress-bar"
            onChange={(e) => onScrub(e.target.value)}
            onMouseUp={onScrubEnd}
            onTouchEnd={onScrubEnd}
          />
          <span className="time">{formatTime(duration)}</span>
        </div>

        <Controls 
          isPlaying={isPlaying} 
          setIsPlaying={setIsPlaying} 
          SkipTrack={SkipTrack} 
        />

        {/* --- VOLUME SLIDER --- */}
        <div className="volume-container">
          <span className="volume-icon">{volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}</span>
          <input 
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            className="volume-slider"
            onChange={(e) => setVolume(parseFloat(e.target.value))}
          />
        </div>

        <p className="next-up">
          Next up: <span>{songs[(currentTrackIndex + 1) % songs.length].title}</span>
        </p>
      </div>
    </div>
  );
}

export default App;