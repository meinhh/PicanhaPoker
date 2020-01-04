import {Card, CardSuit, CardRank} from 'common';

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

    public shuffle(): Deck {
        this.cards = this.cards.sort(() => Math.random() - 0.5);
        return this;
    }
}