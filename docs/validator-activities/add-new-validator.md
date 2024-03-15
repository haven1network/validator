# Adding a New Validator Node to Haven1 Network

## When to Perform This Activity

- This activity should be carried out when instructed by the Haven1 Team.

## Steps to Add a New Validator

1. Update your `static-nodes.json` file with the new one provided by the team.
2. Attach a `geth` console to the node:

    ```bash
    docker run -it quorumengineering/quorum:22.7.1 attach data/geth.ipc
    ```

3. Propose the new validator using the command `istanbul.propose(<address>, true)`. Replace `<address>` with the address of the new validator candidate node:

    ```javascript
    istanbul.propose("0x2aabbc1bb9bacef60a09764d1a1f4f04a47885c1", true);
    ```

4. Exit the console:

    ```javascript
    exit;
    ```
