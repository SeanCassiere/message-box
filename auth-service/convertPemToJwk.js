const fs = require("fs");
const rsaPemToJwk = require("rsa-pem-to-jwk");

const certsDir = __dirname + "/certs";
const jwksDir = __dirname + "/public/.well-known";
const jwksFileName = "jwks.json";

const privateKey = fs.readFileSync(certsDir + "/private.pem");
const jwkKey = rsaPemToJwk(privateKey, { use: "sig" }, "public");

const jwkFileData = JSON.stringify({ keys: [jwkKey] }, null, 2);
fs.writeFileSync(jwksDir + "/" + jwksFileName, jwkFileData);

console.log(`Success, public key converted to jwks file`);
console.log(`jwks.json -> ${jwksDir}/${jwksFileName}`);
console.log("content", jwkFileData);
