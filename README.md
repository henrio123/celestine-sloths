# Bad Kids Shop
Welcome to the Badkids Shop repository! This project is an open-source initiative designed to create a seamless, Shopify-like experience for NFT transactions in the Cosmos ecosystem. It is tailored for both newcomers and veterans, simplifying the process of exploring and purchasing NFTs from any Stargaze NFT collection.

Check out our sample website for the BadKids collection here: https://badkids.shop/

**Key features include:**

1. **NFT Listings**: Displaying NFTs with images, IDs, and current prices. This includes a redirection to the NFT page on Stargaze’s marketplace, and offers flexible sorting options.
    
    https://lh7-us.googleusercontent.com/bkVrqvw-p5y6RXIa5xUgZZMRj79zbmmtwgTx3YPr9H7BD-bfGNDVgWp27ybIFHsoknuGgvA-_ziqF_lTjdaU4m7Vv3oE5IqtRLa_q6RzYntRUjG63VgumfW3R-urkJcxPgjMYKc7GVGUqtu6lKi53C4
    
2. **Wallet Connectivity**: Integrating multiple methods for secure transactions:
    1. Connect and sign a transaction using MetaMask (utilizes Leap’s MetaMask Snaps).
    2. Log in with email and sign transactions (utilizes [Leap’s Social login SDK](https://x.com/leap_cosmos/status/1730626232168092141?s=20)).
    3. Connect with Leap or Keplr.
    
    https://lh7-us.googleusercontent.com/9A0bMjUVA-fI1okaeqMeuy0SwglQmUaJkP-RZgLKqQoZ0wLd3yc9XG66blXmwMXlghrCvPcIbeh5GG-mIe3gXZ98bPtzO-KyPmUzXb4YPHxwQ7a9eYS32TGSRtIqPXZ_JhB34V4V81iiatLOdrfTKnk
    
3. **Get STARS Feature**: Simplifies the process of acquiring the required STARS tokens using assets from other Cosmos chains, EVM chains, or fiat, without having to navigate between different interfaces. This feature is powered by [Leap’s Elements SDK](https://x.com/leap_cosmos/status/1686051798086479872?s=20).
    
    https://lh7-us.googleusercontent.com/jSgOHgvgsNAVcZXzL6oZ3kISq9b5ylMeH5z-VirHspnfhczMcqVdTla8bxO2Xv_FcTyfC64rJUzIt5gN-6dvaTrNlMOrV5VQkZ09cRsWMYyAeoJAwvWKWUEd9FJBLQVaabHnQmSVcckK0UW605G5Km0
    
4. **Follow on 'X' Button**: Redirects users to your collection’s social media pages.

Our repository is structured to enable easy customization and deployment for your NFT projects.


## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Environment Variables](#environment-variables)
  - [Setting up Environment Variables](#setting-up-environment-variables)
  - [Accessing Environment Variables](#accessing-environment-variables)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Prerequisites

List any software or tools that need to be installed before running the project.

- [Node.js](https://nodejs.org/) (version x.x.x)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/) (choose one)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/leapwallet/bad-kids-shop.git
   ```

2. Navigate to the project directory:

   ```bash
   cd bad-kids-shop
   ```

3. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   ```

## Environment Variables

Optional environament variables

```env
NEXT_PUBLIC_NODE_REST_ENDPOINT= // get from https://chains.cosmos.directory/stargaze
NEXT_PUBLIC_NODE_RPC_ENDPOINT= // get from https://chains.cosmos.directory/stargaze
NEXT_PUBLIC_STARGAZE_GRAPHQL_ENDPOINT= // https://graphql.mainnet.stargaze-apis.com/graphql

NEXT_PUBLIC_STARGAZE_MARKET_CONTRACT= //stars1fvhcnyddukcqfnt7nlwv3thm5we22lyxyxylr9h77cvgkcn43xfsvgv0pl
NEXT_PUBLIC_BAD_KIDS_COLLECTION_ID= //stars19jq6mj84cnt9p7sagjxqf8hxtczwc8wlpuwe4sh62w45aheseues57n420
```

Mandatory environment variables for Social login support, connect with [capsule](https://usecapsule.com)

```
NEXT_PUBLIC_CAPSULE_KEY= 
NEXT_PUBLIC_CAPSULE_ENV=
```

Mandatory environment variable for wallet connect

```
NEXT_PUBLIC_WC_PROJECT_ID= 
```

### Setting up Environment Variables

1. Create a `.env.local` file in the root of your project.

   ```plaintext
   // .env.local

   NEXT_PUBLIC_NODE_REST_ENDPOINT=
   NEXT_PUBLIC_NODE_RPC_ENDPOINT=
   NEXT_PUBLIC_STARGAZE_GRAPHQL_ENDPOINT=
   NEXT_PUBLIC_STARGAZE_MARKET_CONTRACT=
   NEXT_PUBLIC_BAD_KIDS_COLLECTION_ID=

   
   NEXT_PUBLIC_WC_PROJECT_ID=
   NEXT_PUBLIC_CAPSULE_KEY= 
   NEXT_PUBLIC_CAPSULE_ENV=
  ```

## Usage

Explain how to run the project locally and any additional steps needed.

```bash
npm run dev
# or
yarn dev
```

This will start the development server, and you can view the app at `http://localhost:3000` in your browser.

## Contributing

Explain how others can contribute to your project. Include information about pull requests, issue reporting, coding standards, etc.

1. Fork the repository.
2. Create a new branch for your feature: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Open a pull request.

## License

This project is licensed under the [License Name] - see the [LICENSE.MIT](LICENSE.MIT) file for details.