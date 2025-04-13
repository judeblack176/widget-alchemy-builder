
import React from 'react';

export const videoRenderer = (finalProps: Record<string, any>) => {
  return (
    <div className="rounded overflow-hidden">
      <video
        src={finalProps.source}
        controls={finalProps.controls !== false}
        autoPlay={finalProps.autoplay === true}
        className="w-full"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};
