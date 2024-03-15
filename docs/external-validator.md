# Setting Up an External Validator Node for Haven1 Network

## Prerequisites

1. Obtain `genesis.json` from the Haven1 Team.
2. Ensure you have [Node.js and NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed (version 14 or higher).
3. Install [Docker and Docker-compose](https://docs.docker.com/compose/install/).

## Generating Keys

1. Create a directory for the new node:

    ```bash
    export base_path=$(pwd)
    mkdir -p ${base_path}/data/keystore
    ```

2. Install and run the [Quorum Genesis Tool](https://www.npmjs.com/package/quorum-genesis-tool):

    ```bash
    npm i -g quorum-genesis-tool
    npx quorum-genesis-tool \
    --validators 1 \
    --members 0 \
    --bootnodes 0 \
    --outputPath artifacts
    ```

3. Copy the generated artifacts:

    ```bash
    cd artifacts/2022-04-21-08-10-29/validator0
    cp nodekey* address ${base_path}/data
    cp account* ${base_path}/data/keystore
    ```

4. Place the `genesis.json` file provided in `${base_path}/data/genesis.json`.

## Sharing Instance Information

1. Share the validator's address and IP with the Haven1 team.
2. Wait for 24 hours for the validation process to complete.

## Running the Node

1. Once validation is complete, execute `docker-compose up` to start the container.
