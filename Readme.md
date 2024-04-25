![Cover](.github/cover.png)

# Haven1 Testnet Validator

Welcome to the Haven1 Testnet Validator repository! This repository
serves as a guide for validators aiming to run validators on the Haven1
Testnet.

Any future updates to this repository will be properly versioned and tagged for
clarity.

This repository utilizes [Docker](https://docs.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) as its base.

Here is the Installation Guide for [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/standalone/).

## Introduction

Haven1 is an EVM-compatible Layer 1 blockchain that seamlessly incorporates key principles of traditional finance into the Web3 ecosystem.

The Haven1 Testnet provides a sandbox environment for developers to experiment with building applications on the Haven1 network, along with an opportunity to interact with a number of our unique features. This repository aims to assist validators to run their own validator instances for the Haven1 Testnet.

It provides the essential set of instructions that validators will need to facilitate being part of the network.

It provides a full testing suite with a number of helpful utility functions, deployment scripts, and tasks.

All code included in this repository has been extensively commented to make it self-documenting and easy to comprehend.

<a id="setup"></a>

## Setup Validator Instance

<a id="Hardware Requirements"></a>

### Hardware Requirements

It is required to have a virtual machine with the following recommended requirements:

- CPU:
- Memory:
- Storage:

<a id="prerequisites"></a>

### Prerequisites

1. Obtain `genesis.json` and `static-nodes.json` from the [Haven1 Team](mailto:contact@haven1.org).
2. Ensure you have [Node.js and NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed (version 14 or higher).
3. Install [Docker](https://docs.docker.com/) and [Docker Compose](https://docs.docker.com/compose/).

### Initial Setup and Key Generation

1. Create a directory for the new node:

    ```bash
    mkdir -p /data/keystore
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
    cp nodekey* address /data
    cp account* /data/keystore
    ```

4. Place the `genesis.json` and `static-nodes.json` files provided by the Haven1 Team in the `data` directory.

5. Get the validator address:

    ```bash
    cat /etc/goquorum/keystore/accountAddress
    ```

### Sharing Instance Information

1. Share the validator's address with the Haven1 team.
2. Wait for 24 hours for the validation process to be complete.

### Spin up the Node

1. Once validation is complete, execute `docker-compose up` to start the container.

## Validator Activities

### Accepting a New Validator Node for Haven1 Network

For a new validator to be accepted in the network, all existing validators need to perform a set of actions.

#### When to Perform This Activity

- This activity should be carried out when instructed by the Haven1 Team.
- You will be provided with a new `static-nodes.json` and the address of the new validator.

#### Steps to Add a New Validator

1. Update your `data/static-nodes.json` file with the new one provided by the team.
2. Attach a `geth` console to the node:

    ```bash
    docker run -it quorumengineering/quorum:22.7.1 attach data/geth.ipc
    ```

3. Propose the new validator using the command `istanbul.propose(<address>, true)`. Replace `<address>` with the address of the new validator candidate node:

    ```javascript
    istanbul.propose("<address>", true);
    ```

4. Exit the console:

    ```javascript
    exit;
    ```

5. Update the Haven1 Team once you have performed the following actions.
