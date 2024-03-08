# Blackjack

Deployed with [here via Vercel](https://blackjack-neon-tau.vercel.app/)

## Intro

Getting back into full-stack development by making my first game post-bootcamp. Fun exercise in game logic and spinning up an app from scratch.

Used a [Deck of Cards api](http://deckofcardsapi.com), which included image links for the cards and string values for the suit and the value of the cards.

### Current functionality

- Game will show a loading state with the back of the card
- Game will add the previous cards' totals
- Game will let user "hit" aka add another card to their own hand.
- Game will end when user clicks stand and show the result of the game.
- Game will reshuffle the deck on clicking reset.

### Current Issues

- Game does not initialize the cards and scores accurately nor consistently
- Game does not calculate scores accurately (will add the cards prior to the new card)
- Needs unit and accessibility testing

### TODO

These todos are in no particular order:

- Add jest and create unit tests
- Update the score calculation
- Add axe accessibility check
- Update styling in case of light mode
- Update the game to allow the dealer/house to also add cards to their hand.
- Start branching properly with PRs instead of making quick commits

Initial version after maybe 4 hours of making mistakes with api calls
![Screenshot 2024-03-06 at 9 01 56 PM](https://github.com/kimdolion/blackjack/assets/49125411/b8ce72be-3878-4f95-8d25-c46f472d55fe)

Current version as of Mar 7, 7:15 PM
![Screenshot 2024-03-07 at 7 24 49 PM](https://github.com/kimdolion/blackjack/assets/49125411/0f435f57-f3a5-4992-a8a1-34963897178b)

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
