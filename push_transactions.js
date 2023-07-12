require('dotenv').config();
const { ethers } = require('ethers');

const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const STORAGE_ADDRESS = process.env.STORAGE_ADDRESS;
const MULTISIG_ADDRESS = process.env.MULTISIG_ADDRESS;

const storage = require("./contracts/Storage.json");
const multisig = require("./contracts/MultiSigWallet.json");

// provider - Alchemy
const alchemyProvider = new ethers.AlchemyProvider(network="maticMumbai", API_KEY);

// signer - you
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

// contract instance
const StorageContract = new ethers.Contract(STORAGE_ADDRESS, storage.abi, signer);
const MultiSigContract = new ethers.Contract(MULTISIG_ADDRESS, multisig.abi, signer);

async function main() {

    // TODO: Read the CSV
    const createUniverseParams = [48, "0xb5015476E2b6a9c09ac9DCeAfF0048310d7C44af", true, "sandbox-iscJE"];
    const createUniverseMethod = 'createUniverse';
    const createUniversePopulated = await StorageContract[createUniverseMethod].populateTransaction(...createUniverseParams);

    // This is the signature that the transaction expects
    const createUniverseEncodedABI = createUniversePopulated.data;

    console.log("Encoded ABI: " + createUniversePopulated.data);

    /*
    console.log("Submitting the tx...");
    const tx = await MultisigContract.submitTransaction(STORAGE_ADDRESS, 0, createUniverseEncodedABI);
    await tx.wait();

    console.log(`Universe ${47} request created.`);
    */
}

main();