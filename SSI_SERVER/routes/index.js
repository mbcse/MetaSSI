var express = require('express');
var router = express.Router();
const {generateES256KKeyPair, generateEdDSAKeyPair} = require('../onyxssi/utils/keygen');
const {getDid, decodeVc, createSignedVp} = require('../onyxssi/index');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({"message": "Welcome to the MetaSSI API"});
});

router.get('/api/v1/generate/keypair/es256k', async (req,res)=>{
  const keyPair = await generateES256KKeyPair();
  res.json(keyPair);
});

router.get('/api/v1/generate/keypair/eddsa', async (req,res)=>{
  const keyPair = generateEdDSAKeyPair();
  res.json(keyPair);
});

router.get('/api/v1/generate/keypair/all', async (req,res)=>{
  const es256kKeyPair = await generateES256KKeyPair();
  const eddsaKeyPair = generateEdDSAKeyPair();
  res.json({es256kKeyPair, eddsaKeyPair});
});



router.post('/api/v1/did', async (req,res)=>{
  const {type, privateKey} = req.body;
  console.log(req.body)
  const did = await getDid(type, privateKey);
  console.log(did)
  res.json(did);
});



router.post('/api/v1/decode/vc', async (req,res)=>{
  const {vcJwt} = req.body;
  console.log(req.body)
  const vc = await decodeVc(vcJwt);
  console.log(vc)
  res.json(vc);
});


router.post('/api/v1/create/vp', async (req,res)=>{
  const {vcJwt, privateKey} = req.body;
  console.log(req.body)
  const vp = await createSignedVp(vcJwt, privateKey);
  console.log(vp)
  res.json(vp);
});





module.exports = router;
