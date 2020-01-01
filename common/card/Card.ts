import { CardSuit } from "./CardSuit";
import { CardRank } from "./CardRank";

export default class Card {
    public constructor(
        public readonly suit?: CardSuit,
        public readonly rank?: CardRank,
    ) {}
}
