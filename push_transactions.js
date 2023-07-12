require('dotenv').config();
const fs = require('fs');
const csv = require('fast-csv');
const { ethers } = require('ethers');

const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const STORAGE_ADDRESS = process.env.STORAGE_ADDRESS;
const MULTISIG_ADDRESS = process.env.MULTISIG_ADDRESS;
const CSV_PATH = "./universe_owners.csv";

const storage = require("./contracts/Storage.json");
const multisig = require("./contracts/MultiSigWallet.json");
const { resolve } = require('path');

// provider - Alchemy
const alchemyProvider = new ethers.AlchemyProvider(network="maticMumbai", API_KEY);

// signer - you
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

// contract instance
const StorageContract = new ethers.Contract(STORAGE_ADDRESS, storage.abi, signer);
const MultiSigContract = new ethers.Contract(MULTISIG_ADDRESS, multisig.abi, signer);

async function readCSV(file)
{
    let data = new Array();
     
    await new Promise((resolve, reject) => fs.createReadStream(file)
      .pipe(csv.parse({ headers: true }))
      .on('error', error => {console.error(error); reject();})
      .on('data', row => data.push(row))
      .on('end', () => {console.log(`CSV file read. ${data.length} rows found`);resolve();})
      );

    return data;
}

async function main() {

    // Process the whole CSV file
    var rows = await readCSV(CSV_PATH);
    for (var i=0; i<rows.length; i++)
    {
        const createUniverseParams = [
            rows[i]["universeId"], 
            rows[i]["web3address"], 
            true, 
            rows[i]["universeName"]
        ];
        const createUniverseMethod = 'createUniverse';
        const createUniversePopulated = await StorageContract[createUniverseMethod].populateTransaction(...createUniverseParams);
    
        // This is the signature that the transaction expects
        const createUniverseEncodedABI = createUniversePopulated.data;
    
        console.log(`Encoded ABI: ${createUniverseEncodedABI} for universeId ${rows[i]["universeId"]}`);

    
        /*
        console.log("Submitting the tx...");
        const tx = await MultisigContract.submitTransaction(STORAGE_ADDRESS, 0, createUniverseEncodedABI);
        await tx.wait();
    
        console.log(`Universe ${47} request created.`);
        */
    
    }
}

main();