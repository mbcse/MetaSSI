const crypto = require('crypto');
const ed25519 = require('@stablelib/ed25519');
const { KEY_ALG } = require('@jpmorganchase/onyx-ssi-sdk');

const { Wallet, ethers } = require('ethers');
const constants = require('../constants');

exports.generateEdDSAKeyPair = function () {
  const seed = () => crypto.randomBytes(32);

  const key = ed25519.generateKeyPair({
    isAvailable: true,
    randomBytes: seed,
  });

  return {
    algorithm: KEY_ALG.EdDSA,
    publicKey: Buffer.from(key.publicKey).toString('hex'),
    privateKey: Buffer.from(key.secretKey).toString('hex'),
  };
};

exports.generateES256KKeyPair = async function () {
  const account = ethers.Wallet.createRandom();
  const { privateKey, compressedPublicKey } = account._signingKey();

  return {
    algorithm: KEY_ALG.ES256K,
    publicKey: compressedPublicKey,
    privateKey,
  };
};

// exports.getEddsaPrivateKey = async function () {
//   let privateKey = await getItem(constants.EDDSA_KEY_NAME);
//   if (privateKey) {
//     console.log(`EDDSA KEY FOUND`);
//     return privateKey;
//   }
//   console.log(`EDDSA KEY NOT FOUND`);
//   console.log(`\nGenerating and saving private key for\n`);
//   privateKey = exports.generateEdDSAKeyPair().privateKey;

//   return privateKey;
// };

// exports.getEs256kPrivateKey = async function () {
//   let privateKey = await getItem(constants.ES256K_KEY_NAME);

//   if (privateKey) {
//     console.log(`ES256 KEY FOUND`);
//     return privateKey;
//   }
//   console.log(`ES256 KEY NOT FOUND`);
//   console.log(`\nGenerating and saving private key for\n`);
//   privateKey = (await exports.generateES256KKeyPair()).privateKey;
//   await setItem(constants.ES256K_KEY_NAME, privateKey);

//   return privateKey;
// };
