# MessageBox

An office productivity application aimed at providing managers more insight into what their employees are currently doing, without using **intrusive/invasive** monitoring tactics.

## Setup

This project has a server and web-client.

Ensure that the relevant environment variables are added based on the `.env.example` file.

BEFORE starting development ensure all the packages have their node_modules added.

```bash
npm run setup:server

npm run setup:web-client
```

Now you can begin development.

```
# Spin up the Docker containers
make up

# Open the web-client development server
npm run web-client
```
