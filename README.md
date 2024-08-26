![Cover](.github/cover.png)

# Haven1 Validator

Welcome to the Haven1 Validator repository! This repository serves as a guide for validators to run validators on Haven1.

We highly recommend setting up your node and processes on AWS because this guide requires Nitro enabled machines.

This repository uses [Docker](https://docs.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) as its base.
Here is the Installation Guide for [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/standalone/).

## Table of Contents

- [Infra Setup](#infra-setup)
- [Setup Validator Instance](#setup-validator-instance)
  - [Validator Hardware Requirements](#validator-hardware-requirements)
  - [Prerequisites](#prerequisites)
  - [Initial Setup and Key Generation](#initial-setup-and-key-generation)
  - [Sharing Instance Information](#sharing-instance-information)
  - [Sharing Validator Wallet Information](#sharing-validator-wallet-information)
  - [Spin up the Node](#spin-up-the-node)
  - [Test that the node is validating as expected](#test-that-the-node-is-validating-as-expected)
- [Setup Cosigner Instance](#setup-cosigner-instance)
  - [Cosigner Hardware Requirements](#cosigner-hardware-requirements)
  - [Installation](#installation)

## Infra Setup

1. Open the AWS CloudShell

2. Install Terraform

    ```bash
    sudo yum install -y yum-utils
    ```

    ```bash
    sudo yum-config-manager --add-repo https://rpm.releases.hashicorp.com/AmazonLinux/hashicorp.repo
    ```

    ```bash
    sudo yum -y install terraform
    ```

    ```bash
    terraform -help
    ```

3. Download the Terraform setup and unzip

    ```bash
    wget https://github.com/haven1network/validator/releases/download/v1.0.0/validator-terraform.tar.gz
    ```

    ```bash
    tar -xvzf validator-terraform.tar.gz
    ```

    ```bash
    cd validator-terraform
    ```

4. Add your configs to the validator.tf

    ```bash
    module "validator" {
        source          = "./modules/validator"
        name            = "<YOUR ORGANISATION NAME HERE>"
        subnet_id       = "<YOUR SUBNET HERE>"
    }
    ```

5. Add your region to the provider.tf

    ```bash
    provider "aws" {
        region = "<YOUR REGION HERE>"
    }
    ```

6. Test your infra setup

    ```bash
    terraform init
    ```

    ```bash
    terraform plan
    ```

    **In case of any issues during step 6, please reach out to the [Haven1 Team](mailto:contact@haven1.org)**

7. Install the infra setup

    ```bash
    terraform apply
    ```

    **In case of any issues during step 7, please reach out to the [Haven1 Team](mailto:contact@haven1.org)**

## Setup Validator Instance

### Validator Hardware Requirements

AWS (t3.medium)

- CPU: 2 vCPU cores
- Memory: 4 GB
- Storage: 100 GB

### Prerequisites

Get the following file from the [Haven1 Team](mailto:contact@haven1.org)

- genesis.base64 (base 64 encoded)

Provide the address where you would like your rewards to be sent ([Haven1 Team](mailto:contact@haven1.org))

### Initial Setup and Key Generation
<!-- Connect to the validator instance and run the following commands -->


1. Install the following packages on your "validator" machine:

    ```bash
    sudo su
    sudo yum install -y git
    sudo yum install -y docker
    DOCKER_CONFIG=${DOCKER_CONFIG:-$HOME/.docker}
    mkdir -p $DOCKER_CONFIG/cli-plugins
    curl -SL https://github.com/docker/compose/releases/download/v2.28.1/docker-compose-linux-x86_64 -o $DOCKER_CONFIG/cli-plugins/docker-compose
    chmod +x $DOCKER_CONFIG/cli-plugins/docker-compose
    chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    source ~/.bashrc
    sudo systemctl start docker
    nvm install 20
    nvm use 20
    ```

2. Clone the repository in a folder which is mounted to a storage which can be expanded as the Haven1 Network keeps adding blocks over time.

    ```bash
    git clone https://github.com/haven1network/validator.git
    ```

3. Create some directories for the new node in the validator directory:

    ```bash
    cd validator
    mkdir -p data keystore
    ```

4. You need to change the `.env` file.

    | Variable    | Value                                 |
    | ----------- | ------------------------------------- |
    | HOSTNAME    | Your Organisation Name                |
    | IP          | Public IP (Elastic IP in case of AWS) |

5. Copy the string inside `genesis.base64` and run the following command

    ```bash
        echo "<YOUR genesis.base64 STRING>" | base64 --decode > data/genesis.json
    ```

6. Install and run the [Quorum Genesis Tool](https://www.npmjs.com/package/quorum-genesis-tool) to generate a new set of keys and node:

    ```bash
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

### Sharing Instance Information

1. Share the following information with the Haven1 team.
    - address
    - accountAddress
    - nodekey.pub
    - `HOSTNAME` value used
    - public IP

    You can use this command, copy the result and send it to us:

    ```bash
    for file in keystore/accountAddress keystore/address keystore/nodekey.pub .env; do printf "%s: %s\n" "$file" "$(cat "$file")"; done
    ```

2. Wait for 24 hours for the integration process to be complete.

### Sharing Validator Wallet Information

1. Share the address of the wallet that would be signing transactions on behalf of the validator. This wallet could be from `Safe`, `Metamask` or even the one created by `geth`. This wallet would be used to sign transactions to add nodes to the networks and other admin related transactions.

### Spin up the Node

- Once the integration is complete, you will receive the following files:
  - static-nodes.json
  - permission-config.json
- Place the files in the `data` folder and run the following command.

    ```bash
    ln -s static-nodes.json permissioned-nodes.json
    ```

- You can spin up the node by running docker-compose in the validator folder

    ```bash
    docker compose up -d
    ```

### Test that the node is validating as expected

- Attach a `geth` console to the node:

    ```bash
    docker compose exec -it node geth attach /data/geth.ipc
    ```

- Verify Syncing Status. It should return `false` once the syncing is completed

    ```javascript
    eth.syncing
    ```

- Once syncing is completed. Verify Mining Status. It should return true if mining is enabled on your validator.

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

### Install the mpc-approver

The MPC approver is used to approve specific transactions that require an additional layer of security. 

1. Download the latest mpc-approver

    ```bash
    wget -O mpc-approver https://github.com/haven1network/validator/releases/download/v1.14.0/mpc-approver-linux-x64
    ```

2. Create the approver keys

    ```bash
    cd mpc-approver
    openssl req -new -newkey rsa:4096 -nodes -keyout approver_secret.key -out approver.csr -subj '/O=HAVEN1'
    ```

   And share with Haven1 team the file `approver.csr`

   Do not share and keep the file `approver_secret.key` safe

3. Create a self-signed TLS certificate

    ```bash
    openssl req -new -newkey rsa:4096 -x509 -sha256 -days 3650 -nodes -out MpcCertificate.crt -keyout MpcKey.key
    ```

    - Enter the Country, State or Province Name, Locality Name, Organization Name, Organizational Unit Name
    - Set `Common Name` as the private IP of your validator instance

4. Export the following variables

    ```bash
    export RPC_HAVEN1=https://rpc.haven1.org
    export BRIDGE_CONTROLLER=0x6fF7796C02a276A88B2E4C3CAE7a219cF8Aa9603
    export TLS_KEY="$(cat MpcKey.key | base64)"
    export TLS_CERT="$(cat MpcCertificate.crt | base64)"
    ```

5. Give permissions and run

    ```bash
    chmod +x mpc-approver
    sudo nohup ./mpc-approver &
    ```

## Setup Cosigner Instance

### Cosigner Hardware Requirements

It is required to have a virtual machine with the following recommended requirements:

AWS (c5a.xlarge)

- CPU: 2 vCPU cores
- Memory: 4 GB

### Installation

1. Unzip the cosigner on your "cosigner" machine:

    ```bash
    sudo su
    cd
    wget -O nitro-cosigner-v2.0.2.tar.gz https://fb-customers-nitro.s3.amazonaws.com/nitro-cosigner-v2.0.2.tar.gz
    tar -xzf nitro-cosigner-v2.0.2.tar.gz
    ```

2. Get the pairing token from the Haven1 Team and use it within 1 hour for step 3

3. Install the cosigning process

    ```bash
    ./install.sh
    ```

    - Enter `pairing token` (i.e. the string provided by the Haven1 team)
    - Enter `S3 Bucket Name` (Name only)
    - Enter `KMS ARN` (Full ARN)
    - Enter `callback URL (leave it empty)`

    ```bash
    ./fireblocks/cosigner callback-update
    ```

    - Enter `Callback URL` (i.e. https://your-validator-private-IP)
    - Enter `2` for certificate
    - Enter `y` for automatically fetching the certificate

4. Wait for an approval from the Haven1 team

## Debugging Validator FAQ

*Problem:* Geth Connection Refused running `attach` command
*Possible Solution:* 
    - Turn off your container
    - remove geth.ipc if you still have a stray `geth.ipc` remaining, then remove it.
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
