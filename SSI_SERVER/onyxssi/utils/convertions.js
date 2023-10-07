exports.privateKeyBufferFromString = function(privateKeyString) {
    const buffer = Buffer.from(privateKeyString, 'hex');
    return new Uint8Array(buffer);
  };