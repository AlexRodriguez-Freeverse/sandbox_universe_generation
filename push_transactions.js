require('dotenv').config();
const fs = require('fs');
const csv = require('fast-csv');
const { ethers } = require('ethers');

const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const STORAGE_ADDRESS = process.env.STORAGE_ADDRESS;
const CSV_PATH = process.env.CSV_PATH;

const storage = require("./contracts/Storage.json");

// Connect to the L2 through Alchemy with the provided user
const alchemyProvider = new ethers.AlchemyProvider(network="maticMumbai", API_KEY);
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

// Contract instances
const StorageContract = new ethers.Contract(STORAGE_ADDRESS, storage.abi, signer);

// It reads the CSV file and creates and array with all the cells accesible by the header name
async function readCSV(file)
{
    let data = new Array();
     
    await new Promise((resolve, reject) => fs.createReadStream(file)
      .pipe(csv.parse({ headers: true }))
      .on('error', error => {
            console.error(error); 
            reject();
        })
      .on('data', row => data.push(row))
      .on('end', () => {
            console.log(`CSV file read. ${data.length} rows found`);
            resolve();
        })
      );

    return data;
}

async function main() {
    // Process the whole CSV file
    var rows = await readCSV(CSV_PATH);
    for (var i=0; i<rows.length; i++)
    {    
        console.log(`Processing universeId ${rows[i]["universeId"]}...`);

        const tx = await StorageContract.createUniverse(
                rows[i]["universeId"],
                rows[i]["web3address"], 
                true, 
                rows[i]["universeName"]
            );
        await tx.wait();
    
        console.log(`Universe created.`);
    }
}

main();