import React from 'react';

// Accept 'isPlaying' as a prop
function Details({ track, isPlaying }) {
  return (
    <div className="details-container">
      {/* 
        We use a template literal and a ternary operator (condition ? true : false)
        to conditionally apply the 'active-spin' class to the img tag.
      */}
      <img 
        className={`track-art ${isPlaying ? 'active-spin' : ''}`} 
        src={track.img_src} 
        alt={track.title} 
      />
      <h2 className="track-title">{track.title}</h2>
      <h3 className="track-artist">{track.artist}</h3>
    </div>
  );
}

export default Details;