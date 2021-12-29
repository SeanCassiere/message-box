const fs = require("fs");
const rsaPemToJwk = require("rsa-pem-to-jwk");

const privateKey = fs.readFileSync(__dirname + "/certs/private.pem");
const jwk = rsaPemToJwk(privateKey, { use: "sig" }, "public");
console.log(jwk);
