import Card from "common/card/Card";
import _ from 'lodash';

export default class HandAnalyzer {
	public determineWinner(communityCards: Card[], playersHands: {[playerName: string]: [Card, Card]}) {

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
