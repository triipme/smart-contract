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
* Run cmd `truffle migrate --network tomotestnet --reset`: deploy contract on TOMO testnet, it takes about 52 TOMO
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
* Run cmd `TOKEN=<token address deployed> TOMO_ISSUER=0x8c0faeb5c6bed2129b8674f262fd45c4e9468bee AMOUNT=<deposit amount> truffle exec cmd/applyTomoIssuer.js --network tomomainnet`: register token address with deposit amount to tomoIssuer contract

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


## Token address:

#### Tomo testnet:
```
Token name: SiroSmile21
Token symbol: SIRO21
Community address: 0x6a86DDfCabe6789CCcd2673A080195b48ed7D8a5
Crowd address: 0x6a86DDfCabe6789CCcd2673A080195b48ed7D8a5
Eco address: 0x6a86DDfCabe6789CCcd2673A080195b48ed7D8a5
Company address: 0x6a86DDfCabe6789CCcd2673A080195b48ed7D8a5
Team address: 0x6a86DDfCabe6789CCcd2673A080195b48ed7D8a5
Founder address: 0x6a86DDfCabe6789CCcd2673A080195b48ed7D8a5
Issuer address: 0x6a86DDfCabe6789CCcd2673A080195b48ed7D8a5
Token address: 0x543bae08844ae7ece8aaf2241bd906eb13d3d3f2
Token deploy tx: 0x956a4fb8ee25e5f1333bf33945df2c01421cbede6c621ba1e06d9e9fc2627875
```

#### Tomo mainnet:
```
Token name: TriipMiles
Token symbol: TIIM
Community address: 0x8D0d19f55D57d38B42f25149652fE7fcab77C036
Crowd address: 0x2656c55dbeAc8102eB13Ec8f965a996361d5CbcA
Eco address: 0x581b06cAFF0C93eC6d0dd0777B493e8fC874e3ca
Company address: 0x6508413C8aCf352f71760f242E0ea4BEC0fCd831
Team address: 0xf1850B4FA06b8b341168d100c17FD3978585D9fd
Founder address: 0x3C6F467Fc1C9E389Be557140136730e4C3f99F00
Issuer address: 0x31Edb6BFb7c9FE6E25D40D7A1831F53532C2E289
Token address: 0x3c6475f8b4200e0a6acf5aeb2b44b769a3d37216
Token deploy tx: 0xe272a57b00fa7323c3974dadc055ea09c1b49b37fff1ee202a801ac3b7caa511
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

##### Call Token approve func:
`MNEMONIC=<mnemonic> TOKEN=<trc21_token_address> SPENDER=<receiver_address> AMOUNT=<transfer_amount> truffle exec cmd/approve.js --network tomotestnet`

##### Call Token transferFrom func:
`MNEMONIC=<mnemonic> TOKEN=<trc21_token_address> FROM=<from_address> TO=<to_address> AMOUNT=<transfer_amount> truffle exec cmd/transferFrom.js --network tomotestnet`


## Refs:
##### TOMO networks
`https://docs.tomochain.com/general/networks/`
`https://docs.tomochain.com/developer-guide/working-with-tomochain/tomochain-mainnet#useful-smart-contract-addresses`

##### TOMO issuer
Testnet: `https://scan.testnet.tomochain.com/address/0x0e2c88753131ce01c7551b726b28bfd04e44003f#code`
Mainnet: `https://scan.tomochain.com/address/0x8c0faeb5c6bed2129b8674f262fd45c4e9468bee`
Code: `https://github.com/tomochain/tomoissuer`

##### TRC21 TIIM
Testnet: `https://scan.testnet.tomochain.com/address/0x543bae08844ae7ece8aaf2241bd906eb13d3d3f2`
Mainnet: `waiting to deploy`


docker run --rm -v $(pwd):/root ethereum/solc:0.4.26 --abi /root/contracts/Token.sol -o /root/build/contracts --overwrite
docker run --rm -v $(pwd):/root ethereum/client-go:alltools-latest abigen --abi=/root/build/contracts/TIIM.abi --pkg=contract --out=/root/build/contracts/token.go
