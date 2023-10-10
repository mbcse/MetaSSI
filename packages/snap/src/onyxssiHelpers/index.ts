import {
  EthrDIDMethod,
  JWTService,
  KeyDIDMethod,
  createAndSignPresentationJWT,
} from '@jpmorganchase/onyx-ssi-sdk';

import { camelCase, includes } from 'lodash';
import constants from '../constants';
import { getItem, setItem } from '../utils/state';
import { getEddsaPrivateKey, getEs256kPrivateKey } from '../utils/keygen';
import { getConfirmation, showMessage } from '../snapHelpers';

export type JwtPayload = {
  [key: string]: any;
  iss?: string | undefined;
  sub?: string | undefined;
  aud?: string | string[] | undefined;
  exp?: number | undefined;
  nbf?: number | undefined;
  iat?: number | undefined;
  jti?: string | undefined;
};

export const getUserDid = async (type: string) => {
  try {
    if (type === 'ethr') {
      const privateKey = await getEs256kPrivateKey();

      const didWithKeys = await fetch(
        `${constants.SSI_SERVER_URL}/api/v1/did`,
        {
          method: 'POST',
          body: JSON.stringify({
            type,
            privateKey,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ).then((response) => response.json());
      console.log(didWithKeys);
      await setItem(constants.DID_ETHR_NAME, didWithKeys?.did);
      return didWithKeys?.did;
    } else if (type === 'key') {
      const privateKey = await getEddsaPrivateKey();

      const didWithKeys = await fetch(
        `${constants.SSI_SERVER_URL}/api/v1/did`,
        {
          method: 'POST',
          body: JSON.stringify({
            type,
            privateKey,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ).then((response) => response.json());
      console.log(didWithKeys);
      await setItem(constants.DID_KEY_NAME, didWithKeys?.did);
      return didWithKeys?.did;
    }
    return 'Invalid DID Type';
  } catch (error) {
    console.log(error);
    return 'Error';
  }
};

export const getVcData = async (vcJwt: string) => {
  const vcdata = await fetch(`${constants.SSI_SERVER_URL}/api/v1/decode/vc`, {
    method: 'POST',
    body: JSON.stringify({
      vcJwt,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json());

  return vcdata;
};

export const storeVC = async (vcJwt: string, vcData: any) => {
  const userVerifiableCredentials = await getItem(constants.VCS_KEY_NAME);
  userVerifiableCredentials[vcData.jti] = { vcJwt, data: vcData };
  await setItem(constants.VCS_KEY_NAME, userVerifiableCredentials);
};

export const issueVC = async (vcJwt: string, origin: string) => {
  const vc = await getVcData(vcJwt);
  const holderDid = vc.sub;
  if (includes(holderDid, 'ethr')) {
    if (holderDid !== (await getItem(constants.DID_ETHR_NAME))) {
      throw new Error('Invalid Holder ETHR Did in your credential');
    }
  } else if (holderDid !== (await getItem(constants.DID_KEY_NAME))) {
    throw new Error('Invalid Holder KEY Did in your credential');
  }

  const confirmed = await getConfirmation(
    `${origin} Wants to Issue you a Verifiable Credential`,
    [
      `VC ID: ${vc.jti}`,
      `Issuer: ${vc.iss}`,
      `Expiry: ${vc.exp || 'NOT Present'}`,
      `Date of Credential Issue: ${new Date(vc.nbf * 1000)}`,
      `Subject: ${vc.sub}`,
      `Context: ${vc.vc['@context']}`,
      `Credential Type: ${vc.vc.type}`,
      `Details: ${JSON.stringify(vc.vc.credentialSubject)}`,
    ],
  );

  if (!confirmed) {
    return await showMessage('Request Denied!', [`User Denied Request`]);
  }

  await storeVC(vcJwt, vc);

  return await showMessage('Request Accepted!', [`Credential Stored!`]);
};

export const getVP = async (vcId: string, origin: string) => {
  const userVerifiableCredentials = await getItem(constants.VCS_KEY_NAME);
  console.log(userVerifiableCredentials);
  const credential = userVerifiableCredentials[vcId];
  console.log(credential);
  const vc = credential.data;
  const confirmed = await getConfirmation(
    `${origin} Wants to get a verifiable presentation of this credential from you`,
    [
      `VC ID: ${vc.jti}`,
      `Issuer: ${vc.iss}`,
      `Expiry: ${vc.exp || 'NOT Present'}`,
      `Date of Credential Issue: ${new Date(vc.nbf * 1000)}`,
      `Subject: ${vc.sub}`,
      `Context: ${vc.vc['@context']}`,
      `Credential Type: ${vc.vc.type}`,
      `Details: ${JSON.stringify(vc.vc.credentialSubject)}`,
    ],
  );

  if (!confirmed) {
    return await showMessage('Request Denied!', [`User Denied Request`]);
  }

  const holderDid = vc.sub;
  const privateKey = includes(holderDid, 'ethr')
    ? await getItem(constants.ES256K_KEY_NAME)
    : await getItem(constants.EDDSA_KEY_NAME);

  const vp = await fetch(`${constants.SSI_SERVER_URL}/api/v1/create/vp`, {
    method: 'POST',
    body: JSON.stringify({
      vcJwt: credential.vcJwt,
      privateKey,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json());

  return vp;
};
