// http://deckofcardsapi.com

// Game must start with a deck to begin
export const getNewDeck = async () => {
  const res = await fetch("https://deckofcardsapi.com/api/deck/new/");
  // Response shape
  // {
  //     success: boolean,
  //     deck_id: string,
  //     remaining: number,
  //     shuffled: boolean
  //   }
  if (!res.ok) {
    throw new Error("Sorry! Couldn't get a new deck.");
  }
  const data = await res.json();
  return data;
};

export interface DeckParams {
  deckId: string;
  newCardCode?: string[];
  pileName?: string;
}

export const getShuffledDeck = async ({ deckId }: DeckParams) => {
  const res = await fetch(
    `https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`,
  );

  if (!res.ok) {
    throw new Error("Sorry! Couldn't shuffle the deck.");
  }
  const data = await res.json();
  return data;
};

export const getInitialCards = async ({ deckId }: DeckParams) => {
  const res = await fetch(
    `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`,
  );
  if (!res.ok) {
    throw new Error("Sorry! Couldn't get initial cards.");
  }
  const data = await res.json();

  return data;
};

export const getNewCard = async ({ deckId }: DeckParams) => {
  const res = await fetch(
    `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`,
  );
  if (!res.ok) {
    throw new Error("Sorry! Couldn't get a new card.");
  }
  const data = await res.json();
  return data;
};

// need to determine what pile to add to
export const addCardToPile = async ({
  deckId,
  newCardCode,
  pileName,
}: DeckParams) => {
  const res = await fetch(
    `https://deckofcardsapi.com/api/deck/${deckId}/pile/${pileName}/add/?cards=${newCardCode}`,
  );
  if (!res.ok) {
    throw new Error(`Sorry! Couldn't add new card to the ${pileName}'s hand.`);
  }
  const data = await res.json();

  return data;
};

export const getPile = async ({ deckId, pileName }: DeckParams) => {
  const res = await fetch(
    `https://deckofcardsapi.com/api/deck/${deckId}/pile/${pileName}/list`,
  );
  if (!res.ok) {
    throw new Error(`Sorry! Couldn't get the ${pileName}'s hand.`);
  }
  const data = await res.json();
  return data;
};

export const calculateCardsValue = ({
  aceValue,
  cards,
}: {
  aceValue: number;
  cards: { value: string }[];
}) => {
  let total = 0;
  cards.map((card: { value: string }) => {
    let value = 0;
    const cardValue = card.value;
    switch (cardValue) {
      case "KING": {
        value = 10;
        break;
      }
      case "QUEEN": {
        value = 10;
        break;
      }
      case "JACK": {
        value = 10;
        break;
      }
      case "ACE": {
        value = aceValue;
        break;
      }
      default:
        value = parseInt(cardValue);
    }
    total += value;
  });
  return total;
};
