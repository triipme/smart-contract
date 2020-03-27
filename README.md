# THE TRIIP PLEDGE

A deep love of the environment and a recognition of the need to take strong, immediate action to protect is at the heart of everything we do. By partnering with us, you’re joining us in our mission to meaningful solutions to the the growing ecological crisis.It means a lot to us, so we’re offering all who sign the Triip Pledge an amount of token. You’re already doing a lot by reading this white paper, so please accept this gift as our show of thanks.

On top of that, we’re contributing 1% of each booking conducted on Triip to a Sustainable Fund that we’re using to advance a series of sustainability projects, including plastic waste reduction program SaveYourOcean.com. We’re a blockchain and travel company, but we’re also much more than that. Similarly, you’re more than just a traveler and a consumer. You’re an important part of the change we all need to make together to chart a different course for the Earth and all those who share our home.


## Contents

 1. [Technical Stack](#technical-stack)
 2. [Setup](#setup)
 3. [Testing](#testing)
 4. [Deploy](#deploy)


## Technical Stack

* node v12.8.0
* npm 6.10.3
* Truffle v5.1.7


## Setup
* `npm install -g truffle` - https://www.trufflesuite.com/docs/truffle/getting-started/installation
* install ganache - https://www.trufflesuite.com/docs/ganache/quickstart
* `truffle compile` - compile contracts


## Testing
* Open ganache and new workspace for testing env:
	* Add `truffle-config.js` to **TRUFFLE PROJECTS** on **WORKSPACE** tab
	* Edit **PORT NUMBER** is `7546`, **NETWORK ID** is `5777` on **SERVER** tab
	* Edit **TOTAL ACCOUNTS TO GENERATE** to `20` at **ACCOUNTS & KEYS** tab
	* Save workspace
* Setup env vars:
	* Run cmd `cp .env.sample .env.test`: duplicate env
	* fill env vars for TRC21 contract
	* Run cmd `export $(cat .env.test)`: export env vars
* Run cmd `truffle migrate --network test --reset`: deploy contract on test env
* Run cmd `truffle test --network test`: execute test cases

#### env vars:
```
TOKEN_NAME: token name
TOKEN_SYMBOL: token symbol
COMMUNITY_RESERVE_WALLET: account address at index 4 on Accounts tab of ganache workspace
CROWD_FUND_WALLET: account address at index 5
ECO_WALLET: account address at index 6
COMPANY_WALLET: account address at index 7
TEAM_WALLET: account address at index 8
FOUNDER_WALLET: account address at index 9
```


## Deploy on TOMO testnet
* Setup env vars:
	* Run cmd `cp .env.sample .env`: duplicate env
	* fill env vars for TRC21 contract
	* Run cmd `export $(cat .env)`: export env vars
* Run cmd `truffle migrate --network tomotestnet --reset`: deploy contract on TOMO testnet, it takes about 48 TOMO
* Run cmd `TOKEN=<token address deployed> TOMO_ISSUER=0x0e2c88753131ce01c7551b726b28bfd04e44003f AMOUNT=10 truffle exec cmd/applyTomoIssuer.js --network tomotestnet`: register token address with 10 TOMO deposit to tomoIssuer contract

#### env vars:
```
MNEMONIC: seed words or private key of owner address, it must have TOMO for deploying
TOKEN_NAME: token name
TOKEN_SYMBOL: token symbol
COMMUNITY_RESERVE_WALLET: community reserve wallet address
CROWD_FUND_WALLET: crowd fund wallet address
ECO_WALLET: eco wallet address
COMPANY_WALLET: company wallet address
TEAM_WALLET: team wallet address
FOUNDER_WALLET: founder wallet address
```

## Deploy on TOMO mainnet
* Setup env vars:
	* Run cmd `cp .env.sample .env`: duplicate env
	* fill env vars for TRC21 contract
	* Run cmd `export $(cat .env)`: export env vars
* Run cmd `truffle migrate --network tomomainnet --reset`: deploy contract on TOMO testnet, it takes about 48 TOMO
* Run cmd `TOKEN=<token address deployed> TOMO_ISSUER=<tomoIssuer address> AMOUNT=<deposit amount> truffle exec cmd/applyTomoIssuer.js --network tomomainnet`: register token address with deposit amount to tomoIssuer contract

#### env vars:
```
MNEMONIC: seed words or private key of owner address, it must have TOMO for deploying
TOKEN_NAME: token name
TOKEN_SYMBOL: token symbol
COMMUNITY_RESERVE_WALLET: community reserve wallet address
CROWD_FUND_WALLET: crowd fund wallet address
ECO_WALLET: eco wallet address
COMPANY_WALLET: company wallet address
TEAM_WALLET: team wallet address
FOUNDER_WALLET: founder wallet address
```


## UCD
![UCD](https://www.lucidchart.com/publicSegments/view/88905324-e47f-4ff6-8780-28534d17dbf3/image.jpeg "UCD")


## Transfer Flow
![Transfer Flow](https://www.lucidchart.com/publicSegments/view/2466a03b-e5e0-4b64-a616-d8795549f5ba/image.jpeg "Transfer Flow")


## CMDs:

##### Register TRC21 token to TOMO issuer for free TOMO gas when transfer Token:
`TOKEN=<trc21_token_address> TOMO_ISSUER=<tomo_issuer_address> AMOUNT=<deposit_amount> truffle exec cmd/applyTomoIssuer.js --network tomotestnet`


##### Transfer Token:
`MNEMONIC=<mnemonic> TOKEN=<trc21_token_address> TO=<receiver_address> AMOUNT=<transfer_amount> truffle exec cmd/sendToken.js --network tomotestnet`


## Refs:
##### TOMO networks
`https://docs.tomochain.com/general/networks/`

##### TOMO Testnet TOMO issuer
`https://scan.testnet.tomochain.com/address/0x0e2c88753131ce01c7551b726b28bfd04e44003f#code`


##### TOMO issuer code
`https://github.com/tomochain/tomoissuer`


##### TOMO Testnet TRC21 token
`https://scan.testnet.tomochain.com/address/0x3a0ea94976766149d4d167678c83e63dbd76eb47#code`


docker run --rm -v $(pwd):/root ethereum/solc:0.4.26 --abi /root/contracts/Token.sol -o /root/build/contracts --overwrite
docker run --rm -v $(pwd):/root ethereum/client-go:alltools-latest abigen --abi=/root/build/contracts/TOKEN.abi --pkg=contract --out=/root/build/contracts/token.go
