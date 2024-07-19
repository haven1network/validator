import { ethers } from "ethers";

const wallet = new ethers.Wallet(
	"PRIVATE_KEY",
);

const message = {
	data: {
		"extraInfo.creatorFirstName": "",
	},
	exp: 1722367481, 
};

const json = JSON.stringify(message);

const base64 = btoa(json);

const signature = await wallet.signMessage(base64);

console.log(`${base64}.${signature}`);