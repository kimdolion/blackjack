"use client";

import Image from "next/image";
import {
  addCardToPile,
  getInitialCards,
  getNewCard,
  getNewDeck,
  getPile,
  getShuffledDeck,
} from "./api/route";
import { useEffect, useState } from "react";

export default function Home() {
  const [deckId, setDeckId] = useState("");
  const [playerPile, setPlayerPile] = useState([]);
  const [playerTotal, setPlayerTotal] = useState(0);
  const [housePile, setHousePile] = useState([]);
  const [houseTotal, setHouseTotal] = useState(0);

  const [gameMessage, setGameMessage] = useState("");
  const [showResult, setShowResult] = useState(false);

  const ace = playerTotal >= 11 ? 1 : 11;

  const handleDeckId = async () => {
    try {
      const newDeck = await getNewDeck();
      setDeckId(newDeck.deck_id);

      deckId !== "" && getInitialPiles();
    } catch (error) {
      console.log(error);
    }
  };

  const calculateCardsValue = ({
    cards,
    pileName,
  }: {
    cards: [];
    pileName: string;
  }) => {
    let total = pileName === "player" ? playerTotal : houseTotal;
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
          value = ace;
          break;
        }
        default:
          value = parseInt(cardValue);
      }
      total += value;
    });
    pileName === "player" ? setPlayerTotal(total) : setHouseTotal(total);
  };

  const getInitialPiles = async () => {
    try {
      const initialHouseCards = await getInitialCards({ deckId });
      const initialPlayerCards = await getInitialCards({ deckId });
      initialHouseCards.cards.map(async (houseCard: { code: string }) => {
        await addCardToPile({
          deckId,
          newCardCode: houseCard.code,
          pileName: "house",
        });
      });

      initialPlayerCards.cards.map(async (playerCard: { code: string }) => {
        await addCardToPile({
          deckId,
          newCardCode: playerCard.code,
          pileName: "player",
        });
      });
      const initialHousePile = await getPile({ deckId, pileName: "house" });
      setHousePile(initialHousePile.cards);

      const initialPlayerPile = await getPile({ deckId, pileName: "house" });
      setPlayerPile(initialPlayerPile.cards);

      calculateCardsValue({ cards: housePile, pileName: "house" });
      calculateCardsValue({ cards: playerPile, pileName: "player" });
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlayerHit = async () => {
    // is it better to combine the api call to go ahead and add the new card to the pile?
    const card = await getNewCard({ deckId });

    await addCardToPile({
      deckId,
      newCardCode: card.cards[0].code,
      pileName: "player",
    });

    const newPile = await getPile({ deckId, pileName: "player" });

    setPlayerPile(newPile.piles.player.cards);
    calculateCardsValue({ cards: playerPile, pileName: "player" });
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

    await getShuffledDeck({ deckId });
    setTimeout(() => {
      setPlayerTotal(0);
      setHouseTotal(0);
      setPlayerPile([]);
      setHousePile([]);
      setShowResult(false);
    }, 5000);
  };

  useEffect(() => {
    handleDeckId();
    setShowResult(false);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <h1 className="text-3xl">Blackjack</h1>
        <div>
          <p>Dealer's Hand: {houseTotal}</p>
          <div className="container flex justify-between gap-2">
            {housePile.length > 0 &&
              housePile.map((houseCard: { code: string; image: string }) => {
                console.log("house card ", houseCard);
                return (
                  <Image
                    key={houseCard.code}
                    alt="card"
                    src={houseCard.image}
                    height={200}
                    width={200}
                  />
                );
              })}
          </div>
        </div>
        <div>
          <p>Player Hand: {playerTotal}</p>
          <div className="container flex justify-between gap-2">
            {playerPile.length > 0 &&
              playerPile.map((houseCard: { code: string; image: string }) => {
                console.log("house card ", houseCard);
                return (
                  <Image
                    key={houseCard.code}
                    alt="card"
                    src={houseCard.image}
                    height={200}
                    width={200}
                  />
                );
              })}
          </div>
          <div className="container flex justify-between gap-4 mt-4">
            <button
              className="border p-4 rounded w-1/2"
              onClick={handlePlayerHit}
            >
              Hit
            </button>
            <button
              className="border p-4 rounded w-1/2"
              onClick={handlePlayerStand}
            >
              Stand
            </button>
          </div>
        </div>
        {showResult && (
          <p className="text-2xl text-red-700 mt-4">{gameMessage}</p>
        )}
      </div>
    </main>
  );
}
