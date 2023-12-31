/* eslint-disable no-console */

/*
Generates a series of brand new identity and encrypts it with a randomly generated password.
It flushes everything on a CSV file. Use at your own risk. The generated information is very sensitive.
*/

require('dotenv').config();
const { appendFileSync, existsSync } = require('fs');
const generator = require('generate-password');
const identity = require('freeverse-crypto-js');

const CSV_PATH = process.env.CSV_PATH;
const NUM_ROWS = process.env.NUM_ROWS;

// It is retrieven from here: https://mumbai.polygonscan.com/address/0x30B6492570D73035062f854903b8F3035785Cc7E#readContract#F31
// It is not allowed to use random numbers for the universe id, they need to be consecutive
const STARTING_UNIVERSE_ID = process.env.STARTING_UNIVERSE_ID;

class UniverseOwner {
    constructor() {
        // Generate a randow password 15 characters and numbers length
        const password = generator.generate({
            length: 15,
            numbers: true
        });

        // Populate the fields with the information of the newly created account
        const newId = identity.createNewAccount();
        const encrypted = identity.encryptIdentity(newId.privateKey, password);
        
        this.web3address = newId.address;
        this.encryptedId = encrypted;
        this.userPassword = password;
        this.privateKey = newId.privateKey;
        this.publicKey = identity.publicKeyFromPrivateKey(newId.privateKey);
        // Generate a short universe name. Last 4 chars of the owner
        this.universeName = "sandbox-" + newId.address.slice(-4);
    }

    // Writes the object in a CSV file. It is appended to the existing file
    saveAsCSV(universe_id) {
      try {
        // Write the headers if the file does not exist
        if (!existsSync(CSV_PATH))
        {
            const header = `universeId,web3address,universeName,encryptedId,userPassword,privateKey,publicKey\n`;
            appendFileSync(CSV_PATH, header);
        }

        // Flush the class attributes in a new row
        const csv = `${universe_id},${this.web3address},${this.universeName},${this.encryptedId},${this.userPassword},${this.privateKey},${this.publicKey}\n`;
        appendFileSync(CSV_PATH, csv);
      } catch (err) {
        console.error(err);
      }
    }
  }

// It creates 100 universe owners
const startApp = () => {
    for (var i=0; i<NUM_ROWS; i++)
    {
        const universeOwner = new UniverseOwner();
        universeOwner.saveAsCSV(parseInt(STARTING_UNIVERSE_ID) + i);
    }
}
startApp();