import Card from "common/card/Card";
import _ from 'lodash';
import Deck from "./Deck";

export default class HandAnalyzer {
	private readonly COMMUNITY_CARD_COUNT = 5;
	private readonly TIMES_TO_RUN = 1000;

	public determineProbability(communityCards: Card[], playersHands: { [playerName: string]: [Card, Card] },
								deck: Deck) {
		return _.chain(_.range(this.TIMES_TO_RUN))
			.map(() => deck.clone().shuffle())
			.map(currDeck => [
				...communityCards,
				...(_.range(this.COMMUNITY_CARD_COUNT - communityCards.length).map(() => currDeck.draw())),
			])
			.map(currCommunityCards => this.determineWinner(currCommunityCards, playersHands))
			.groupBy()
			.mapValues((x: number) => x / this.TIMES_TO_RUN)
			.value();
	}

	public determineWinner(communityCards: Card[], playersHands: { [playerName: string]: [Card, Card] }) {

	}

	private getPlayerHandValue(communityCards: Card[], playerHand: [Card, Card]) {

	}

	private hasPair(cards: Card[]): boolean {
		return _.chain(cards)
			.groupBy(c => c.rank)
			.pickBy(c => c.length === 2)
			.some()
			.value();
	}

	private hasTwoPair(cards: Card[]): boolean {
		return _.chain(cards)
			.groupBy(c => c.rank)
			.pickBy(c => c.length === 2)
			.some()
			.value();
	}
}

enum HandValue {
	HighCard,
	Pair,
	TwoPair,
	Triplets,
	Straight,
	Flush,
	Boat,
	Quads,
	StraightFlush,
	RoyalFlush,
}
