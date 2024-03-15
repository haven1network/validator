# How to run an external validator node for Haven1 Network

## Prerequisites

1. `genesis.json` from the Haven1 Team
2. [Node.js and NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) version 14 or higher
3. [Docker and Docker-compose](https://docs.docker.com/compose/install/)

## Generate Keys
  
1. Create a working directory for the new node that needs to be added:
  
```bash

export base_path=$(pwd)
mkdir -p  ${base_path}/data/keystore

```

2. Install and run the [Quorum Genesis Tool](https://www.npmjs.com/package/quorum-genesis-tool):

```bash
npm i quorum-genesis-tool
```
  
```bash
npx quorum-genesis-tool \
--validators 1 \
--members 0 \
--bootnodes 0 \
--outputPath artifacts
```

3. Copy the latest generated artifacts:

```bash

cd artifacts/2022-04-21-08-10-29/validator0

cp nodekey* address ${base_path}/data

cp account* ${base_path}/data/keystore

```
  
4. Store the `genesis.json` file provided to the path `${base_path}/data/genesis.json`

## Share Instance

1. Share the address of the validator and IP of the validator instance with the haven1 team
2. Wait for 24 hours for the validation process for a new validator to be finished

## Run the node

1. Once the validation process is finished you can run the `docker-compose up` command to spin up the container
