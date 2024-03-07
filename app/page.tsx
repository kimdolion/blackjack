"use client";

import Image from "next/image";
import {
  addCardToPile,
  getInitialPiles,
  getNewCard,
  getNewDeck,
  getPile,
} from "./api/route";
import { useEffect, useState } from "react";

export default function Home() {
  const [deckId, setDeckId] = useState("");
  const [playerPile, setPlayerPile] = useState([]);
  const [playerTotal, setPlayerTotal] = useState(0);
  const [housePile, setHousePile] = useState([]);
  const [houseTotal, setHouseTotal] = useState(0);
  const [error, setError] = useState(false);

  const handleDeckId = async () => {
    try {
      const newDeck = await getNewDeck();
      setDeckId(newDeck.deck_id);
      deckId !== "" && (await getInitialHousePile());
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };

  const getInitialHousePile = async () => {
    const initialCards = await getInitialPiles({ deckId });
    console.log("initial cards ", initialCards);
    setHousePile(initialCards.cards);
    calculateCardsValue();
  };

  useEffect(() => {
    handleDeckId();
  }, []);

  // app needs to be able to
  // determine win/lose conditions
  // win  house > 21 player < 21
  // house < 21 but player <21 && > house
  // total = 21 and house !== 21

  // lose
  // tie with house
  // player > 21 && player < house
  const ace = playerTotal >= 11 ? 1 : 11;

  const calculateCardsValue = () => {
    console.log("playerpile ", playerPile);
    let total = 0;
    playerPile.map((playerCard: { value: string }) => {
      const value =
        playerCard.value === "ACE" ? ace : parseInt(playerCard.value);
      total += value;
    });
    setPlayerTotal(total);
  };

  const handlePlayerHit = async () => {
    const card = await getNewCard({ deckId });

    await addCardToPile({
      deckId,
      newCardCode: card.cards[0].code,
      pileName: "player",
    });

    const newPile = await getPile({ deckId, pileName: "player" });

    setPlayerPile(newPile.piles.player.cards);
    calculateCardsValue();
  };

  // const handlePlayerPass = async () => {
  //   // await addCard();
  // };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <h1 className="text-3xl">Blackjack</h1>
        <div>
          <p>Dealer's Hand: {houseTotal}</p>
          <div className="container flex justify-between gap-2">
            {housePile.map((houseCard: { code: string; image: string }) => {
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
            {playerPile.map((houseCard: { code: string; image: string }) => {
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
            <button className="border p-4 rounded w-1/2">Pass</button>
          </div>
        </div>
      </div>
    </main>
  );
}
