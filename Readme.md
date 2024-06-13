![Cover](.github/cover.png)

# Haven1 Testnet Validator

Welcome to the Haven1 Testnet Validator repository! This repository
serves as a guide for validators aiming to run validators on the Haven1
Testnet.

Any future updates to this repository will be properly versioned and tagged for
clarity.

This repository utilizes [Docker](https://docs.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) as its base.

Here is the Installation Guide for [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/standalone/).

For networking we use a vpn called [Tailscale](https://tailscale.com/download)

## Introduction

Haven1 is an EVM-compatible Layer 1 blockchain that seamlessly incorporates key principles of traditional finance into the Web3 ecosystem.

The Haven1 Testnet provides a sandbox environment for developers to experiment with building applications on the Haven1 network, along with an opportunity to interact with a number of our unique features. This repository aims to assist validators to run their own validator instances for the Haven1 Testnet.

It provides the essential set of instructions that validators will need to facilitate being part of the network.

It provides a full testing suite with a number of helpful utility functions, deployment scripts, and tasks.

All code included in this repository has been extensively commented to make it self-documenting and easy to comprehend.

## Table of Contents

- [Introduction](#introduction)
- [Setup Validator Instance](#setup-validator-instance)
  - [Hardware Requirements](#hardware-requirements)
  - [Prerequisites](#prerequisites)
  - [Initial Setup and Key Generation](#initial-setup-and-key-generation)
  - [Sharing Instance Information](#sharing-instance-information)
  - [Spin up the Node](#spin-up-the-node)
  - [Test New Node](#test-node-is-validating)
- [Validator Activities](#validator-activities)
  - [Accepting a New Validator Node for Haven1 Network](#accepting-a-new-validator-node-for-haven1-network)

## Setup Validator Instance

### Hardware Requirements

It is required to have a virtual machine with the following recommended requirements:

- CPU: 2 vCPU cores
- Memory: 4 GB
- Storage: 100 GB

### Prerequisites

1. Obtain following from the [Haven1 Team](mailto:contact@haven1.org).
    - genesis.json file
    - TS_AUTHKEY
2. Ensure you have [Node.js and NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed (version 14 or higher).
3. Install [Docker](https://docs.docker.com/) and [Docker Compose](https://docs.docker.com/compose/).

### Initial Setup and Key Generation

1. We need the following packages in the machine:
    - git
    - docker
    - docker-compose
    - npm
    - nodejs
    - [tailscale](https://tailscale.com/download)

2. Clone the repository in a folder which is mounted to a storage which can be expanded in the future as the Haven1 Network keeps adding blocks with time.

    ```bash
    git clone git@github.com:haven1network/validator.git
    ```

    If you dont have ssh setup use the http url

    ```bash
    git clone https://github.com/haven1network/validator.git
    ```

3. Create some directories for the new node in the validator directory:

    ```bash
    cd validator
    mkdir -p data keystore
    ```

4. You need to make the follonwing changes in the `.env` file.

| Variable    | Value                                |
| ----------- | ------------------------------------ |
| TS_HOSTNAME | Organisation Name                    |
| TS_AUTHKEY  | `TS_AUTHKEY` Provided by haven1 team |
| NETWORKID   | `810` for testnet  `8110` for devnet |

5. Place the `genesis.json` file provided in the `data` directory.

6. Install and run the [Quorum Genesis Tool](https://www.npmjs.com/package/quorum-genesis-tool) to generate a new set of keys and node:

    ```bash
    npm i -g quorum-genesis-tool
    npx quorum-genesis-tool \
    --validators 1 \
    --members 0 \
    --bootnodes 0 \
    --outputPath artifacts
    ```

7. Copy the generated artifacts:

    ```bash
    cp artifacts/*/validator0/nodekey* keystore
    cp artifacts/*/validator0/account* keystore
    cp artifacts/*/validator0/address keystore
    rm -rf artifacts
    ```

8. Get the validator accountAddress, address and nodekey.pub:

    validator accountAddress

    ```bash
    cat keystore/accountAddress
    ```

    validator address

    ```bash
    cat keystore/address
    ```

    validator nodekey.pub

    ```bash
    cat keystore/nodekey.pub
    ```

9. Turn on tailscale node for IP assignment.

    ```bash
    export $(cat .env | xargs)
    # root use is needed for this command
    tailscale up --hostname=$TS_HOSTNAME --authkey=$TS_AUTHKEY --accept-routes=true --accept-dns=true --ssh
    ```

### Sharing Instance Information

1. Share the following information with the Haven1 team.
    - address
    - accountAddress
    - nodekey.pub
    - `TS_HOSTNAME` value used
2. Wait for 24 hours for the validation process to be complete.

### Spin up the Node

- Once the validation is complete you will recived the following files
    - static-nodes.json
    - permission-config.json
- Place the files in the `data` folder and run the following command.

    ```bash
    ln -s static-nodes.json permissioned-nodes.json
    ```

- make sure tailscale is up

    ```bash
    tailscale status
    ```

- You can spin up the node by running docker-compose in the validator folder

    ```bash
    docker-compose up -d
    ```

### Test Node is Validating

- Attach a `geth` console to the node:

    ```bash
    docker run -it quorumengineering/quorum:22.7.1 attach data/geth.ipc
    ```

- Verify Syncing Status. It should return `false` once the syncing is completed

    ```javascript
    eth.syncing
    ```

- Once syncing is completed. Verify Mining Status. It should return true if mining is enabled on validators.

    ```javascript
    eth.mining
    ```

The peer count should be equal to the total number of nodes minus one (representing the node itself).

- Verify Block Number. To ensure that new blocks are being added to the blockchain, check the current block number with the following command:

    ```javascript
    eth.blockNumber
    ```

This number should increase over time as new blocks are added.

- If all tests generate positive results, we have successfully added a new RPC node.

- Exit the Geth console

    ```javascript
    exit
    ```

## Validator Activities

### Accepting a New Validator Node for Haven1 Network

For a new validator to be accepted in the network, all existing validators need to perform a set of actions.

#### When to Perform This Activity

- This activity should be carried out when instructed by the Haven1 Team.
- You will be provided with an updated `static-nodes.json` and the following information of the new validator.
    - address
    - accountAddress
    - encodeID

#### Steps to Add a New Validator

1. Update your `data/static-nodes.json` file with the new one provided by the Haven1 Team.
2. Attach a `geth` console to the node:

    ```bash
    docker run -v $(pwd)/data:/data -it quorumengineering/quorum:22.7.1 attach /data/geth.ipc
    ```

3. Propose the new validator using the command `istanbul.propose(<address>, true)`. Replace `<address>` with the address of the new validator candidate node:

    ```javascript
    istanbul.propose("<address>", true);
    ```

4. Add new node to the `HAVEN1` Organisation

    ```javascript
    quorumPermission.addNode("HAVEN1","<enodeId>", { from: eth.accounts[0] });
    ```

5. Approve New Admin

    ```javascript
    # First Admin need to start the proposal system for new admin
    quorumPermission.assignAdminRole("HAVEN1", "0xd141a28cdcc1b939926b56dcd394a02c11adb416", "ADMIN", { from: eth.accounts[0] })
    # Subsequent Admin need to approve the new admin
    quorumPermission.approveAdminRole("HAVEN1", "0xd141a28cdcc1b939926b56dcd394a02c11adb416", { from: eth.accounts[0] });
    ```

6. Exit the console:

    ```javascript
    exit;
    ```

7. Update the Haven1 Team once you have performed the following actions.

## Debugging Validator FAQ

*Problem:* Geth Connection Refused running `attach` command
*Possible Solution:* 
    - Turn off your container
    - remove geth.ipc if you still have a stray `geth.ipc` remaining then remove it.
    - Start the container again and retry again
    ```bash
    docker-compose down
    rm -f data/geth.ipc
    docker-compose up -d
    ```

*Problem:* No file geth.ipc
*Possible Solution:*
    - Check if container is running.
    - If the container is running then check the logs if there is any specific issue.
    - Check if you have `geth.ipc` present in your local folder
