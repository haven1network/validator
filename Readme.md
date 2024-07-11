![Cover](.github/cover.png)

# Haven1 Validator

Welcome to the Haven1 Validator repository! This repository serves as a guide for validators to run validators on Haven1.

It is highly recommended to setup your node and processes on AWS as they require SGX enabled machines.

This repository utilizes [Docker](https://docs.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) as its base.
Here is the Installation Guide for [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/standalone/).

## Table of Contents
- [Infra Setup](#infra-setup)
- [Setup Validator Instance](#setup-validator-instance)
  - [Hardware Requirements](#hardware-requirements)
  - [Prerequisites](#prerequisites)
  - [Initial Setup and Key Generation](#initial-setup-and-key-generation)
  - [Sharing Instance Information](#sharing-instance-information)
  - [Spin up the Node](#spin-up-the-node)
  - [Test New Node](#test-node-is-validating)
- [Setup Cosigner Instance](#setup-cosigner-instance)
  - [Hardware Requirements](#hardware-requirements)
  - [Prerequisites](#prerequisites)
  - [Initial Setup and Key Generation](#initial-setup-and-key-generation)
- [Validator Activities](#validator-activities)
  - [Accepting a New Validator Node for Haven1 Network](#accepting-a-new-validator-node-for-haven1-network)

## Infra Setup
1. Open the AWS cloudshell 

2. Install terraform

    ```bash
    sudo yum install -y yum-utils
    ```

    ```bash
    sudo yum-config-manager --add-repo https://rpm.releases.hashicorp.com/AmazonLinux/hashicorp.repo
    ```

    ```bash
    sudo yum -y install terraform
    terraform -help
    ```

3. Download the terraform setup and unzip

    ```bash
    wget https://github.com/haven1network/validator/releases/download/v1.0.0/validator-terraform.tar.gz

    tar -xvzf validator-terraform.tar.gz
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

5. Test your infra setup

    ```bash
    cd validator-terraform
    terraform init
    terraform plan
    ```

    **In case of any issues during step 6 please reach out to the [Haven1 Team](mailto:contact@haven1.org)**

7. Install the infra setup

    ```bash
    terraform apply
    ```
    **In case of any issues during step 7 please reach out to the [Haven1 Team](mailto:contact@haven1.org)**

## Setup Validator Instance

### Hardware Requirements (already installed through Infra Setup)

AWS (t3.medium)
- CPU: 2 vCPU cores
- Memory: 4 GB
- Storage: 100 GB

### Prerequisites

Obtain the following file from the [Haven1 Team](mailto:contact@haven1.org)
- genesis.json file

### Initial Setup and Key Generation

1. Install the following packages on your "validator" machine:
    ```bash
    sudo yum install git
    sudo yum install docker
    DOCKER_CONFIG=${DOCKER_CONFIG:-$HOME/.docker}
    mkdir -p $DOCKER_CONFIG/cli-plugins
    curl -SL https://github.com/docker/compose/releases/download/v2.28.1/docker-compose-linux-x86_64 -o $DOCKER_CONFIG/cli-plugins/docker-compose
    chmod +x $DOCKER_CONFIG/cli-plugins/docker-compose
    sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    nvm install 14
    ```

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

4. You need to make the following changes in the `.env` file.

    | Variable    | Value                                |
    | ----------- | ------------------------------------ |
    | HOSTNAME    | Your Organisation Name               |

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
9. Setup the envs

    ```bash 
    export $(cat .env | xargs)
    ```

### Sharing Instance Information

1. Share the following information with the Haven1 team.
    - address
    - accountAddress
    - nodekey.pub
    - `HOSTNAME` value used
2. Wait for 24 hours for the validation process to be complete.

### Spin up the Node

- Once the validation is complete you will recived the following files
    - static-nodes.json
    - permission-config.json
- Place the files in the `data` folder and run the following command.

    ```bash
    ln -s static-nodes.json permissioned-nodes.json
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
### Install the mpc-approver
The MPC approver is used to approve specific transactions that require an additional layer of security. 

1. Download the latest mpc-approver

    ```bash
    wget -O mpc-approver https://github.com/haven1network/mpc-approver/releases/download/1.11.0/mpc-approver-linux-x64
    ```

2. Create a self-signed TLS certificate
    
    ```bash
    openssl req -new -newkey rsa:4096 -x509 -sha256 -days 3650 -nodes -out MyCertificate.crt -keyout MyKey.key
    ```
	- Enter the Country, State or Province Name, Locality Name, Organization Name, Organizational Unit Name
	- Set `Common Name` as the private IP of your instance


3. Export the following variables

    ```bash
	export RPC_HAVEN1=https://rpc.haven1.org
	export BRIDGE_CONTROLLER=0x6fF7796C02a276A88B2E4C3CAE7a219cF8Aa9603
	export TLS_KEY="$(cat MyKey.key | base64)"
	export TLS_CERT="$(cat MyCertificate.crt | base64)"
    ```

4. Give permissions and run 

    ```bash
    chmod +x mpc-approver
    ./mpc-approver
    ```

## Setup Cosigner Instance

### Hardware Requirements

It is required to have a virtual machine with the following recommended requirements:

AWS (c5a.xlarge)
- CPU: 2 vCPU cores
- Memory: 4 GB

### Installation

sudo su

cd

wget -O nitro-cosigner-v2.0.2.tar.gz https://fb-customers.s3.amazonaws.com/install-script/nitro-cosigner-v2.0.2.tar.gz?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA5QO5IU7PYPUJ7AU6%2F20240708%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240708T161147Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=649bfe4698aefdfcc6ea63a2bdcdea37bb7c957dd26459b1d0576be256f288b1

tar -xzf nitro-cosigner-v2.0.2.tar.gz


./install.sh


Enter pairing token
Enter S3 Bucket Name (Name only)
Enter KMS ARN(Full ARN)
Enter callback URL (ex. https://0.0.0.0)
Enter the public key from Installing the Callback MyCertificate.crt

Wait for an approval


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
