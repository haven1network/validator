# How to run add a new validator node to Haven1 Network

## When to do this activity

- When the Haven1 Team contacts you.

## Steps to add a new validator

1. Update your `static-nodes.json` with the new file provided by the team
2. Attach a `geth` console to the node:

```bash
docker run -it quorumengineering/quorum:22.7.1 attach data/geth.ipc
```

2. Propose the new validator using the command [`istanbul.propose(<address>, true)`](../../reference/api-methods.md#istanbul_propose) with `<address>` replaced by the new validator candidate node address:
  
```javascript

istanbul.propose("0x2aabbc1bb9bacef60a09764d1a1f4f04a47885c1", true);

```

Exit the console:

```javascript

exit;

```
