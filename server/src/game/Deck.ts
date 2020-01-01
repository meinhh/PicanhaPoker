import Card from 'common/card/Card';
import { CardSuit } from 'common/card/CardSuit';
import { CardRank } from 'common/card/CardRank';
import shuffle from 'lodash/shuffle';

export default class Deck {
    private readonly cards: Card[];

    public constructor(cards?: Card[]) {
        this.cards = cards ? cards : this.initializeNewDeck();
    }

    public clone() : Deck {
        return new Deck(this.cards);
    }

    public shuffle(): Deck {
        shuffle(this.cards);
        return this;
    }

    public draw(): Card {
        return this.cards.pop();
    }

    private initializeNewDeck(): Card[] {
        const cards = [];
        for (const suit of Object.values(CardSuit)) {
            for (const rank of Object.values(CardRank)) {
                let card = new Card();
                card.rank = CardRank[rank];
                card.suit = CardSuit[suit];

                cards.push(card);
            }
        }

        return shuffle(cards);
    }
}