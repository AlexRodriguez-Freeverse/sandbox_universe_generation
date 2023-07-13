# Pre creation of universes in an environment

It comprises 2 steps:
1. Generate the CSV file with all the owners and names of the universe
2. Iterate the CSV files for calling the createUniverse method in the smart contract

## Universe properties generation

Use `node bulk_generate_identity.js` to run this step. If the CSV file is already present, this step can be skipped.

It creates a predefined number of universe owners, and stores them in a CSV file. The file is located in the local path: universe_owners.csv
Each row has:
- web3address
- encryptedId
- userPassword
- privateKey
- publicKey

It appends rows if the file already exists.

## Calling the smart contract

Use `node push_transactions.js` to run this step.

It will process all the universe creation requests in the file.

## Configuration

The `.env` file has this structure:
```
API_KEY = "<YOUR_ALCHEMY_API_KEY>"
PRIVATE_KEY = "<THE_PK_THAT_WILL_MAKE_THE_INTERACTION_WITH_THE_BLOCKCHAIN>"
STORAGE_ADDRESS = "<STORAGE_ADDRESS_[DEV|STAGING]>"
CSV_PATH = "./FILENAME_OF_THE_CSV.csv"
NUM_ROWS = NUM_OF_UNIVERSES_TO_CREATE
STARTING_UNIVERSE_ID = IT_CANNOT_BE_GAPS_IN_THE_IDX
```