"use client";

import { useCallback, useEffect, useState } from "react";
import { CardList } from "./component.cardList";
import {
  addCardToPile,
  calculateCardsValue,
  getInitialCards,
  getNewCard,
  getNewDeck,
  getPile,
  getShuffledDeck,
} from "./utils";
import { Button } from "./component.button";
import Link from "next/link";
import { Github } from "lucide-react";

export default function Home() {
  const [deckId, setDeckId] = useState("");
  const [playerPile, setPlayerPile] = useState([]);
  const [playerTotal, setPlayerTotal] = useState(0);
  const [housePile, setHousePile] = useState([]);
  const [houseTotal, setHouseTotal] = useState(0);
  const [resetGame, setResetGame] = useState(false);

  const [gameMessage, setGameMessage] = useState("");
  const [showResult, setShowResult] = useState(false);

  const houseAceValue = houseTotal >= 11 ? 1 : 11;
  const playerAceValue = playerTotal >= 11 ? 1 : 11;

  const getId = async () => {
    const deckResponse = await getNewDeck();
    if (deckResponse.success) {
      const newDeckID = deckResponse.deck_id;
      setDeckId(newDeckID);
      getInitialHousePile(newDeckID);
      getInitialPlayerPile(newDeckID);
    }
  };

  const getInitialHousePile = useCallback(
    async (id: string) => {
      // better to initialize with 4 cards and split the two between the two piles?
      const initialHouseCardsResponse = await getInitialCards({ deckId: id });

      const houseCards = initialHouseCardsResponse.cards;
      // add each card to their pile
      const cardAddedResponse = await addCardToPile({
        deckId: id,
        newCardCode: houseCards.map(
          (houseCard: { code: string }) => houseCard.code,
        ),
        pileName: "house",
      });

      if (cardAddedResponse.success) {
        const houseCardPileResponse = await getPile({
          deckId: id,
          pileName: "house",
        });
        const newHousePile = houseCardPileResponse.piles.house.cards;
        console.log(newHousePile);
        setHousePile(newHousePile);

        const newTotal = calculateCardsValue({
          aceValue: houseAceValue,
          cards: housePile,
        });
        setHouseTotal(newTotal);
      }
    },
    [houseAceValue, housePile],
  );

  const getInitialPlayerPile = useCallback(
    async (id: string) => {
      const initialPlayerCardsResponse = await getInitialCards({ deckId: id });

      const playerCards = initialPlayerCardsResponse.cards;
      // add each card to their pile
      const cardAddedResponse = await addCardToPile({
        deckId: id,
        newCardCode: playerCards.map(
          (playerCard: { code: string }) => playerCard.code,
        ),
        pileName: "player",
      });

      if (cardAddedResponse.success) {
        const playerCardPileResponse = await getPile({
          deckId: id,
          pileName: "player",
        });
        const newPlayerPile = playerCardPileResponse.piles.player.cards;
        setPlayerPile(newPlayerPile);
        const newTotal = calculateCardsValue({
          aceValue: playerAceValue,
          cards: playerPile,
        });
        setPlayerTotal(newTotal);
      }
    },
    [playerAceValue, playerPile],
  );

  const handlePlayerHit = async () => {
    // is it better to combine the api call to go ahead and add the new card to the pile?
    const cardResponse = await getNewCard({ deckId });
    const newPlayerCard = cardResponse.cards;
    const addedNewCardResponse = await addCardToPile({
      deckId,
      newCardCode: newPlayerCard[0].code,
      pileName: "player",
    });
    if (addedNewCardResponse.success) {
      const newPileResponse = await getPile({ deckId, pileName: "player" });
      const newPileCards = newPileResponse.piles.player.cards;
      setPlayerPile(newPileCards);
      const newTotal = calculateCardsValue({
        aceValue: playerAceValue,
        cards: playerPile,
      });
      setPlayerTotal(newTotal);
    }
  };

  const checkGameCondition = () => {
    // The House’s total is > 21 and your total is < 21 (for the purposes of this project,
    // you can ignore this condition, since the House will only have two cards and cannot get a total > 21)
    // your current total is < 21 but higher than the House’s total
    // Your current total is 21 and the House’s total is not 21
    if (playerTotal === houseTotal) {
      setGameMessage("It's a tie. House Wins.");
    } else if (
      (playerTotal < 21 && playerTotal > houseTotal) ||
      (playerTotal === 21 && houseTotal !== 21)
    ) {
      setGameMessage("Player Wins!");
    } else {
      setGameMessage("House Wins :(");
    }
    setShowResult(true);
  };

  // check winner and reset the game after 5 secs
  const handlePlayerStand = async () => {
    checkGameCondition();

    const shuffleResponse = await getShuffledDeck({ deckId });
    if (shuffleResponse.success) {
      setResetGame(true);
    }
  };

  const handleReset = () => {
    setPlayerTotal(0);
    setHouseTotal(0);
    setPlayerPile([]);
    setHousePile([]);
    setShowResult(false);
    getInitialHousePile(deckId);
    getInitialPlayerPile(deckId);
    setResetGame(false);
  };

  // get and set Game Id, which is needed for any calls going forward
  useEffect(() => {
    getId();
  }, []);

  return (
    <div>
      <main className="flex min-h-screen flex-col items-center justify-between p-8">
        <div>
          <h1 className="text-6xl text-center my-4">Blackjack</h1>
          {deckId === "" ? (
            <p>Loading...</p>
          ) : (
            <div className="divide-y-2 divide-gray-400">
              <div className="my-8">
                <p>Dealer&apos;s Hand: {houseTotal}</p>
                <div className="container flex justify-evenly gap-2 flex-wrap">
                  {/* add loading state? */}
                  <CardList cards={housePile ?? []} />
                </div>
              </div>
              <div className="my-8">
                <p className="my-4">Player Hand: {playerTotal}</p>
                <div className="container flex justify-between gap-2 flex-wrap">
                  {/* add loading state? */}
                  <CardList cards={playerPile ?? []} />
                </div>
                <div className="container flex justify-between gap-4 mt-4">
                  <Button disabled={resetGame} onClick={handlePlayerHit}>
                    Hit
                  </Button>
                  <Button disabled={resetGame} onClick={handlePlayerStand}>
                    Stand
                  </Button>
                </div>
              </div>
              {/* Had dark mode on automatically, will need to check for this on others or else red text might not show well */}
              {showResult && (
                <div className="flex flex-col justify-center items-center gap-4 mt-4">
                  <p className="text-2xl text-red-700 mt-4">{gameMessage}</p>
                  <Button onClick={handleReset}>Reset Game</Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <footer>
        <div className="flex justify-between gap-2 m-4">
          <p>
            Made by{" "}
            <Link
              className="underline"
              href={"https://www.linkedin.com/in/kimberly-wilkes/"}
            >
              Kimberly Wilkes
            </Link>{" "}
            with Next.js, TypeScript, and TailwindCSS
          </p>
          <Link
            className="flex gap-2 underline"
            href={"https://github.com/kimdolion/blackjack"}
            target="_blank"
          >
            <Github />
            Github
          </Link>
        </div>
      </footer>
    </div>
  );
}
