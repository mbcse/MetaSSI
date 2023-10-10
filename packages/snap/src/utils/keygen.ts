import { randomBytes } from 'crypto';
import { KeyPair } from '@jpmorganchase/onyx-ssi-sdk';
import * as ed25519 from '@stablelib/ed25519';
import { Wallet, ethers } from 'ethers';
import constants from '../constants';
import { getItem, setItem } from './state';

export const generateEdDSAKeyPair = async (): Promise<any> => {
  try {
    const seed = () => randomBytes(32);

    const key = ed25519.generateKeyPair({
      isAvailable: true,
      randomBytes: seed,
    });

    return {
      algorithm: 'EDDSA',
      publicKey: Buffer.from(key.publicKey).toString('hex'),
      privateKey: Buffer.from(key.secretKey).toString('hex'),
    };
  } catch (error) {
    console.log(error);
    const keyData = await fetch(
      `${constants.SSI_SERVER_URL}/api/v1/generate/keypair/eddsa`,
    ).then((response) => response.json());
    return keyData;
  }
};

export const generateES256KKeyPair = async (): Promise<any> => {
  try {
    const account: Wallet = ethers.Wallet.createRandom();
    const { privateKey, compressedPublicKey } = account._signingKey();

    return {
      algorithm: 'ES256K',
      publicKey: compressedPublicKey,
      privateKey,
    };
  } catch (error) {
    console.log(error);
    const keyData = await fetch(
      `${constants.SSI_SERVER_URL}/api/v1/generate/keypair/es256k`,
    ).then((response) => response.json());
    return keyData;
  }
};

export const getEddsaPrivateKey = async () => {
  let privateKey = await getItem(constants.EDDSA_KEY_NAME);
  if (privateKey) {
    console.log(`EDDSA KEY FOUND`);
    return privateKey;
  }
  console.log(`EDDSA KEY NOT FOUND`);
  console.log(`\nGenerating and saving private key for\n`);
  privateKey = (await generateEdDSAKeyPair()).privateKey;
  await setItem(constants.EDDSA_KEY_NAME, privateKey);

  return privateKey;
};

export const getEs256kPrivateKey = async () => {
  let privateKey = await getItem(constants.ES256K_KEY_NAME);

  if (privateKey) {
    console.log(`ES256 KEY FOUND`);
    return privateKey;
  }
  console.log(`ES256 KEY NOT FOUND`);
  console.log(`\nGenerating and saving private key for\n`);
  privateKey = (await generateES256KKeyPair()).privateKey;
  await setItem(constants.ES256K_KEY_NAME, privateKey);

  return privateKey;
};
