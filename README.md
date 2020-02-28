# THE TRIIP PLEDGE

A deep love of the environment and a recognition of the need to take strong, immediate action to protect is at the heart of everything we do. By partnering with us, you’re joining us in our mission to meaningful solutions to the the growing ecological crisis.It means a lot to us, so we’re offering all who sign the Triip Pledge an amount of token. You’re already doing a lot by reading this white paper, so please accept this gift as our show of thanks.

On top of that, we’re contributing 1% of each booking conducted on Triip to a Sustainable Fund that we’re using to advance a series of sustainability projects, including plastic waste reduction program SaveYourOcean.com. We’re a blockchain and travel company, but we’re also much more than that. Similarly, you’re more than just a traveler and a consumer. You’re an important part of the change we all need to make together to chart a different course for the Earth and all those who share our home.

# Contents

 1. [Technical Stack](#technical-stack)
 2. [Setup](#setup)
 3. [Testing](#testing)
 4. [Deploy](#deploy)

 5. [Dev Smart Contract UI Setup](#smart-contract-ui-setup)

# Technical Stack

* node v12.8.0
* npm 6.10.3
* Truffle v5.1.7

# Setup
* `npm install -g truffle` - https://www.trufflesuite.com/docs/truffle/getting-started/installation
* install ganache - https://www.trufflesuite.com/docs/ganache/quickstart
* `truffle compile` - compile contracts

# Testing
* `truffle test --network test`

# Deploy
* `cp .env.sample .env`: duplicate env
* fill init params for TRC21 contract:
* `export $(cat .env)`: export env vars
* `truffle migrate --network <network> --reset`

### env vars:

```
MNEMONIC: seed words or private key of owner address, it must have ETH for deploying
TOKEN_NAME: token name
TOKEN_SYMBOL: token symbol
COMMUNITY_RESERVE_WALLET: community reserve wallet address
CROWD_FUND_WALLET: crowd fund wallet address
ECO_WALLET: eco wallet address
COMPANY_WALLET: company wallet address
TEAM_WALLET: team wallet address
FOUNDER_WALLET: founder wallet address
```

# UCD
https://www.lucidchart.com/publicSegments/view/88905324-e47f-4ff6-8780-28534d17dbf3/image.jpeg


# Transfer Flow
https://www.lucidchart.com/publicSegments/view/2466a03b-e5e0-4b64-a616-d8795549f5ba/image.jpeg


# TOMO Testnet TOMO issuer
https://scan.testnet.tomochain.com/address/0x0e2c88753131ce01c7551b726b28bfd04e44003f#code


## TOMO issuer code
https://github.com/tomochain/tomoissuer


# TOMO Testnet TRC21. token
https://scan.testnet.tomochain.com/address/0x3a0ea94976766149d4d167678c83e63dbd76eb47#code


# CMD:

## Register TRC21 token to TOMO issuer for free TOMO gas when transfer Token
TOKEN=<trc21_token_address> TOMO_ISSUER=<tomo_issuer_address> truffle exec cmd/applyTomoIssuer.js --network tomotestnet


## Transfer Token
MNEMONIC=<mnemonic> TOKEN=<trc21_token_address> TO=<receiver_address> AMOUNT=<transfer_amount> truffle exec cmd/sendToken.js --network tomotestnet
