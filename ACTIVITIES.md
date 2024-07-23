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
    docker exec -it validator-node-1 geth attach /data/geth.ipc
    ```

3. Propose the new validator using the command `istanbul.propose("0x<address>", true)`. Replace `<address>` with the address of the new validator candidate node:

    ```javascript
    istanbul.propose("0x<address>", true);
    ```

4. Add new node to the `HAVEN1` Organisation

    ```javascript
    quorumPermission.addNode("HAVEN1","<enodeId>", { from: eth.accounts[0] });
    ```

5. Approve New Admin

    ```javascript
    # First Admin need to start the proposal system for new admin
    quorumPermission.assignAdminRole("HAVEN1", "<accountAddress>", "ADMIN", { from: eth.accounts[0] })
    # Subsequent Admin need to approve the new admin
    quorumPermission.approveAdminRole("HAVEN1", "<accountAddress>", { from: eth.accounts[0] });
    ```

6. Exit the console:

    ```javascript
    exit;
    ```

7. Update the Haven1 Team once you have performed the following actions.

## Cosigner config changes approval process

1. You will be given a `.h1t` file. The format of the file is `<base64 data>.<signature>`.
2. Verify the rule in step 1 by decoding the `<base64 data>`
3. Download and place the file into rules directory
```bash
wget -P rules <h1t_url>
```

## Config changes proposal

Contact the Haven1 team to get instructions on how to make a config change proposal
