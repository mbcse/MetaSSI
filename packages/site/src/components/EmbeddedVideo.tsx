import React from 'react';

const EmbeddedVideo = () => {
  return (
    <div
      style={{ position: 'relative', paddingBottom: '1rem', height: '50rem' }}
    >
      <iframe
        src="https://www.loom.com/embed/0db29939db2246018d745476b2e1bd65?sid=64161746-bf67-4096-8be1-1a5fc753c387"
        style={{ height: '40rem', width: '70rem' }}
      ></iframe>
    </div>
  );
};

export default EmbeddedVideo;
