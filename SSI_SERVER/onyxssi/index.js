const {
    EthrDIDMethod,
    KeyDIDMethod,
    createAndSignPresentationJWT,
    getSubjectFromVP,
    JWTService,
  } = require('@jpmorganchase/onyx-ssi-sdk');
  
  const constants = require('./constants');
  const { getEddsaPrivateKey, getEs256kPrivateKey } = require('./utils/keygen');
const { privateKeyBufferFromString } = require('./utils/convertions');
  
  exports.getDid = async (type, privateKey) => {
    try {
      if (type === 'ethr') {
        const didEthr = new EthrDIDMethod(constants.ethrProvider);
        const didWithKeys = await didEthr.generateFromPrivateKey(privateKey);
        return didWithKeys;
      } else if (type === 'key') {
        const didKey = new KeyDIDMethod();
        const didWithKeys = await didKey.generateFromPrivateKey(privateKeyBufferFromString(privateKey));
        return didWithKeys;
      }
      return 'Invalid DID Type';
    } catch (error) {
      console.log(error);
      return 'Could Not Retrieve DID';
    }
  };



  exports.decodeVc = async (vcJwt) => {
    const jwtService = new JWTService();
    const vc = jwtService.decodeJWT(vcJwt)?.payload;
    return vc;
  }
  

  exports.createSignedVp = async (vcJwt, privateKey) => {
    const jwtService = new JWTService();
    const vc = jwtService.decodeJWT(vcJwt)?.payload;
    const holderDid = vc.sub;

    if (holderDid.includes('ethr')) {
        const didWithKeys = await exports.getDid('ethr', privateKey);
        const signedVp = await createAndSignPresentationJWT(didWithKeys, [
            vcJwt,
        ]);
        return signedVp;
    } else {
        const didWithKeys = await exports.getDid('key', privateKey);
        const signedVp = await createAndSignPresentationJWT(didWithKeys, [
            vcJwt,
        ]);
        return signedVp;
    }
  }