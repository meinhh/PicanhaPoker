import Card from 'common/Card';
import { CardSuit } from 'common/CardSuit';
import { CardRank } from 'common/CardRank';

export default class Deck {
    private cards: Card[];

    public constructor() {
        this.cards = [];

        for (const suit of Object.values(CardSuit)) {
            for (const rank of Object.values(CardRank)) {
                let card = new Card();
                card.rank = CardRank[rank];
                card.suit = CardSuit[suit];

                this.cards.push(card);
            }
        }

        this.shuffle();
    }

    public draw(): Card {
        return this.cards.pop();
    }

    public shuffle(): void {
        this.cards = this.cards.sort(() => Math.random() - 0.5);
    }
}