# [Stately](https://stately.ai/) ❤️ React CPH

This repo contains the demo app for a talk by [Anders Bech Mellson](https://twitter.com/andersmellson) at [Copenhagen React Copenhagen's](https://twitter.com/reactcph) [⚛️ August meetup! ☀️](https://www.meetup.com/copenhagen-react-meetup/events/287545945/).

The repo's `main` branch contains the app's boilerplate, leaving it up to you to complete the requirements from the next section.

## Requirements

1. Make it possible to mark a user as a friend and best friend.
2. Handle possible errors.
3. Add retry logic.
4. Debounce the search query.
5. Show an error on timeout.

## Example Branches

- The `react` branch contains a basic version of the app that handles some of the features (1 & 2).
- The `stately` branch contains a more complete version of the app that handles all features.

## Tech Stack

This repo is based on the tRPC example [next-prisma-starter](https://github.com/trpc/trpc/tree/main/examples/next-prisma-starter)

- 🧙‍♂️ E2E typesafety with [tRPC](https://trpc.io)
- ⚡ Full-stack React with Next.js
- ⚡ Database with Prisma
- ⚙️ VSCode extensions
- 🎨 ESLint + Prettier

## Setup & Development

**pnpm:** ([how to install pnpm](https://pnpm.io/installation))

```bash
pnpm i
pnpm dx
```

### Requirements

- Node >= 14
- Docker (for running Postgres)

### Commands

```bash
pnpm build      # runs `prisma generate` + `prisma migrate` + `next build`
pnpm db-nuke    # resets local db
pnpm dev        # starts next.js
pnpm dx         # starts postgres db + runs migrations + seeds + starts next.js
```

## Links

- Stately - [stately.ai](https://stately.ai/)
- Stately Discord - [discord.gg/xstate](https://discord.gg/xstate)
- [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=statelyai.stately-vscode)
