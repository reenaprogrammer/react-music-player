import React from 'react';

function Controls({ isPlaying, setIsPlaying, SkipTrack }) {
  return (
    <div className="controls-container">
      <button className="ctrl-btn secondary" onClick={() => SkipTrack(false)}>⏮️</button>
      <button className="ctrl-btn main" onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? '⏸️' : '▶️'}
      </button>
      <button className="ctrl-btn secondary" onClick={() => SkipTrack(true)}>⏭️</button>
    </div>
  );
}

export default Controls;