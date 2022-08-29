# Setup JWKS

To setup the JWKS, you need to create a new key pair.

```bash
mkdir certs
cd certs
openssl genrsa -out private.pem 3072 # This is the private key
openssl rsa -in private.pem -pubout -out public.pem # This is the public key
```

Then you need to create a JWKS file.

```bash
npm run proc:pemToJwk
```

The created output file should mirror the structure of [jwks.example.json](./public/.well-known/jwks.example.json)
