import Image from "next/image";
import { BACK_OF_CARD_SRC } from "./constants";

export interface CardListProps {
  cards: {
    code: string;
    image: string;
    images: {
      png: string;
      svg: string;
    };
    suit: string;
    value: string;
  }[];
}

export const CardList = ({ cards }: CardListProps) => {
  // Render a placeholder card image, using the back of the card for
  if (cards.length < 1) {
    return (
      <Image
        alt="Back of card"
        src={BACK_OF_CARD_SRC}
        height={200}
        width={200}
      />
    );
  }

  return cards.map((card) => (
    <Image
      key={card.code}
      alt={`Card is ${card.value} of ${card.suit}`}
      src={card.image}
      height={200}
      width={200}
    />
  ));
};
