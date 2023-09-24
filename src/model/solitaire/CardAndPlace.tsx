import Card from "./Card";
import CardLocation from "./CardLocation";

class CardAndPlace {
  public card: Card;
  public place: CardLocation;

  constructor(card: Card, place: CardLocation) {
    this.card = card;
    this.place = place;
  }
}

export default CardAndPlace;