# Lottery Frontend

A simple decentralized application (dApp) that allows users to buy lottery tickets with USDT and lets the contract owner draw a random winner using Chainlink VRF.  The UI is built with **Vue 3**, **Vite** and **Vuetify 3**, with on-chain interaction powered by **wagmi**, **viem**, and **RainbowKit-Vue**.

View the [demo](https://lottery-front.netlify.app/).

---

## ✨ Tech Stack

| Category | Package |
| -------- | ------- |
| Framework / Build | [Vue 3](https://vuejs.org/) + [Vite](https://vitejs.dev/) |
| UI | [Vuetify 3](https://vuetifyjs.com/) |
| State | [Pinia](https://pinia.vuejs.org/) |
| Blockchain | [wagmi](https://wagmi.sh/), [viem](https://viem.sh/), [RainbowKit-Vue](https://rainbowkit.vue-aquamana.dev/) |
| Data-fetching | [@tanstack/vue-query](https://tanstack.com/query/latest/docs/framework/vue/overview) |
| Tooling | TypeScript, ESLint, Prettier |

---

## 🚀 Features

1. **Buy Tickets** – Users can purchase a ticket with USDT (price set in `.env`).  Approval/allowance is handled automatically.
2. **Participants List** – See who has already bought tickets (addresses are anonymised to `You` for the current wallet).
3. **Draw Winner (Owner-only)** – When 5 tickets are sold, the owner can trigger `drawWinner()`.  The UI stays in a _waiting_ state until the `WinnerPaid` event arrives.
4. **Real-time Events** – UI updates instantly on `TicketBought` and `WinnerPaid` contract events.
5. **Snackbar / Alerts** – Friendly toast notifications and alerts guide the user through each action.

---

## 🛠️ Prerequisites

* **Node ≥18**  (supports `npm`, `yarn`, `pnpm`, or `bun`)
* A browser wallet (MetaMask, Rabby, etc.) connected to **Sepolia** testnet.
* Contract addresses deployed on Sepolia.

---

## 📦 Installation

```bash
# clone repository
$ git clone https://github.com/your-org/lottery-front.git
$ cd lottery-front

# install deps (choose your package manager)
$ pnpm install # or yarn / npm install
```

---

## 🔧 Configuration

Create `.env.local` (ignored by git) or edit `.env` with the following keys:

```env
# Contract addresses
VITE_LOTTERY_CONTRACT_ADDRESS=0x...
VITE_USDT_CONTRACT_ADDRESS=0x...

# Ticket price in USDT smallest units (e.g. 1000000 = 1 USDT for 6-decimals)
VITE_LOTTERY_TICKET_PRICE=1000000
```

---

## 🏗️ Running Locally

```bash
pnpm dev  # vite dev server at http://localhost:5173
```

The app automatically connects to the wallet if authorised.  Make sure your wallet is on **Sepolia**.

---

## 🏄‍♂️ Production Build

```bash
pnpm build   # outputs to /dist
pnpm preview # locally preview production build
```

---

## 📚 Scripts

| Command | Description |
| ------- | ----------- |
| `dev` | Start dev server with HMR |
| `build` | Type-check &amp; build for production |
| `type-check` | Run `vue-tsc` for TS type checks |
| `lint` | Run ESLint |

---

## ⚖️ License

MIT © 2025 Yuri Cooliq


This is the official scaffolding tool for Vuetify, designed to give you a head start in building your new Vuetify application. It sets up a base template with all the necessary configurations and standard directory structure, enabling you to begin development without the hassle of setting up the project from scratch.

## 💿 Install

Set up your project using your preferred package manager. Use the corresponding command to install the dependencies:

| Package Manager                                                | Command        |
|---------------------------------------------------------------|----------------|
| [yarn](https://yarnpkg.com/getting-started)                   | `yarn install` |
| [npm](https://docs.npmjs.com/cli/v7/commands/npm-install)     | `npm install`  |
| [pnpm](https://pnpm.io/installation)                          | `pnpm install` |
| [bun](https://bun.sh/#getting-started)                        | `bun install`  |

After completing the installation, your environment is ready for Vuetify development.

## ✨ Features

- 🖼️ **Optimized Front-End Stack**: Leverage the latest Vue 3 and Vuetify 3 for a modern, reactive UI development experience. [Vue 3](https://v3.vuejs.org/) | [Vuetify 3](https://vuetifyjs.com/en/)
- 🗃️ **State Management**: Integrated with [Pinia](https://pinia.vuejs.org/), the intuitive, modular state management solution for Vue.
- 🚦 **Routing and Layouts**: Utilizes Vue Router for SPA navigation and vite-plugin-vue-layouts-next for organizing Vue file layouts. [Vue Router](https://router.vuejs.org/) | [vite-plugin-vue-layouts-next](https://github.com/loicduong/vite-plugin-vue-layouts-next)
- 💻 **Enhanced Development Experience**: Benefit from TypeScript's static type checking and the ESLint plugin suite for Vue, ensuring code quality and consistency. [TypeScript](https://www.typescriptlang.org/) | [ESLint Plugin Vue](https://eslint.vuejs.org/)
- ⚡ **Next-Gen Tooling**: Powered by Vite, experience fast cold starts and instant HMR (Hot Module Replacement). [Vite](https://vitejs.dev/)
- 🧩 **Automated Component Importing**: Streamline your workflow with unplugin-vue-components, automatically importing components as you use them. [unplugin-vue-components](https://github.com/antfu/unplugin-vue-components)
- 🛠️ **Strongly-Typed Vue**: Use vue-tsc for type-checking your Vue components, and enjoy a robust development experience. [vue-tsc](https://github.com/johnsoncodehk/volar/tree/master/packages/vue-tsc)

These features are curated to provide a seamless development experience from setup to deployment, ensuring that your Vuetify application is both powerful and maintainable.

## 💡 Usage

This section covers how to start the development server and build your project for production.

### Starting the Development Server

To start the development server with hot-reload, run the following command. The server will be accessible at [http://localhost:3000](http://localhost:3000):

```bash
yarn dev
```

(Repeat for npm, pnpm, and bun with respective commands.)

> Add NODE_OPTIONS='--no-warnings' to suppress the JSON import warnings that happen as part of the Vuetify import mapping. If you are on Node [v21.3.0](https://nodejs.org/en/blog/release/v21.3.0) or higher, you can change this to NODE_OPTIONS='--disable-warning=5401'. If you don't mind the warning, you can remove this from your package.json dev script.

### Building for Production

To build your project for production, use:

```bash
yarn build
```

(Repeat for npm, pnpm, and bun with respective commands.)

Once the build process is completed, your application will be ready for deployment in a production environment.

## 📑 License
[MIT](http://opensource.org/licenses/MIT)
