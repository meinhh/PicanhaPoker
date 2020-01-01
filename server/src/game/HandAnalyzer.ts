import Card from "common/card/Card";
import _ from 'lodash';
import Deck from "./Deck";
import { CardRank } from "common/card/CardRank";
import { CardSuit } from "common/card/CardSuit";

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
			.mapValues((x: string[]) => x.length / this.TIMES_TO_RUN)
			.value();
	}
		const handsValues: _.mapValues(playersHands, hand => this.HandValue([...communityCards, ...hand]));

	}

	private PairPredicate(cards: Card[]): boolean {
		return _.chain(cards)
			.groupBy(c => c.rank)
			.pickBy(c => c.length === 2)
			.some()
			.value();
	}

	private TwoPairPredicate(cards: Card[]): boolean {
		return _.chain(cards)
			.groupBy(c => c.rank)
			.pickBy(c => c.length === 2)
			.size().value() == 2;
	}

	private TripletPredicate(cards: Card[]): boolean {
		return _.chain(cards)
			.groupBy(c => c.rank)
			.pickBy(c => c.length === 3)
			.some()
			.value();
	}

	private StraightPredicate(cards: Card[], suit?: CardSuit): boolean {
		return this.BestStraight(cards, suit) > 0;
	}

	private BestStraight(cards: Card[], suit?: CardSuit): CardRank {
		const clonedCards = cards.map(card => new Card(card.suit, card.rank));
		
		cards.filter(card => card.rank == CardRank.Ace)
			.forEach(ace => clonedCards.push(new Card(ace.suit, CardRank.One)));

		const existingStraights = clonedCards.filter(
			card => [
				new Card(card.suit, card.rank),
				new Card(card.suit, card.rank + 1),
				new Card(card.suit, card.rank + 2),
				new Card(card.suit, card.rank + 3),
				new Card(card.suit, card.rank + 4)
			].every(possibleStraightCard => clonedCards.filter(
				card => card.rank == possibleStraightCard.rank && 
				suit? card.suit == possibleStraightCard.suit : true)
			)
		);

		const max = _.maxBy(existingStraights, card => card.rank);
		return max === undefined ? undefined : max.rank + 4;
	}

	private FlushPredicate(cards: Card[]): boolean {
		return _.chain(cards)
			.groupBy(c => c.suit)
			.pickBy(c => c.length >= 5)
			.some()
			.value();
	}

	private BoatPredicate(cards: Card[]): boolean {
		const existingTriplets = _.chain(cards)
			.groupBy(c => c.rank)
			.pickBy(c => c.length === 3)
			.keys()
			.value();

		return existingTriplets.map(tripletCard => cards.filter(card => card.rank != tripletCard))
			.filter(cards => this.PairPredicate(cards)).some();
	}

	private QuadsPredicate(cards: Card[]): boolean {
		return _.chain(cards)
			.groupBy(c => c.rank)
			.pickBy(c => c.length === 4)
			.some()
			.value();
	}

	private StraightFlushPredicate(cards: Card[]): boolean {
		return 
			this.StraightPredicate(cards, CardSuit.Clubs) ||
			this.StraightPredicate(cards, CardSuit.Spades) ||
			this.StraightPredicate(cards, CardSuit.Diamonds) ||
			this.StraightPredicate(cards, CardSuit.Hearts);
	}

	private RoyalFlushPredicate(cards: Card[]): boolean {
		return 
			this.BestStraight(cards, CardSuit.Clubs) == CardRank.Ace ||
			this.BestStraight(cards, CardSuit.Spades) == CardRank.Ace ||
			this.BestStraight(cards, CardSuit.Diamonds) == CardRank.Ace ||
			this.BestStraight(cards, CardSuit.Hearts) == CardRank.Ace;
	}

	private HandValue(cards: Card[]): HandValue {
		return _.max(Object.keys(this.handValuesPredicates)
			.filter(handValue => this.handValuesPredicates[handValue](cards)))
	}

	private handValuesPredicates = {
		[HandValue.HighCard]: (cards: Card[]) => true,
		[HandValue.Pair]: (cards: Card[]) => this.PairPredicate(cards),
		[HandValue.TwoPair]: (cards: Card[]) => this.TwoPairPredicate(cards),
		[HandValue.Triplets]: (cards: Card[]) => this.TripletPredicate(cards),
		[HandValue.Straight]: (cards: Card[]) => this.StraightPredicate(cards),
		[HandValue.Flush]: (cards: Card[]) => this.FlushPredicate(cards),
		[HandValue.Boat]: (cards: Card[]) => this.BoatPredicate(cards),
		[HandValue.Quads]: (cards: Card[]) => this.QuadsPredicate(cards),
		[HandValue.StraightFlush]: (cards: Card[]) => this.StraightFlushPredicate(cards),
		[HandValue.RoyalFlush]: (cards: Card[]) => this.RoyalFlushPredicate(cards)
	}

	private takeTopN(cards: Card[], numOfCards: number) : Card[] {
		return
			_.take(
				cards.sort((firstCard, secondCard) => firstCard.rank > secondCard.rank ? 1 : -1), numOfCards
			);
	}
	private highCardFullHand(cards: Card[]): Card[] {
		return this.takeTopN(cards, 5);
	}

	private pairFullHand(cards: Card[]): Card[] {
		const pairRank = _.chain(cards)
			.groupBy(c => c.rank)
			.pickBy(c => c.length === 2)
			.keys()
			.first();

		const [pair, remainingCards] = _.partition(cards, card => card => card.rank == pairRank);

		return [...pair, ...this.takeTopN(remainingCards, 3)];
	}

	private twoPairFullHand(cards: Card[]): Card[] {
		const pairRanks =_.chain(cards)
			.groupBy(c => c.rank)
			.pickBy(c => c.length === 2)
			.keys()
			.sort()
			.reverse()
			.take(2);
		
		const [pairs, remainingCards] = _.partition(cards, card => pairRanks.includes(card.rank));

		return [...pairs, ...this.takeTopN(remainingCards, 1)];
	}
	
	private TripletFullHand(cards: Card[]): Card[] {
		const tripletRank = parseInt(_.chain(cards)
			.groupBy(c => c.rank)
			.pickBy(c => c.length === 3)
			.keys()
			.first()
			.value());
		
		const triplet = cards.filter(card => card.rank == tripletRank);
		const remainingCards = cards.filter(card => card.rank != tripletRank);

		return [...triplet, ...this.takeTopN(remainingCards, 2)];
	}

	private straightFullHand(cards: Card[]): Card[] {
		const topStraightRank = this.BestStraight(cards);
		const straightRanks = [topStraightRank - 4, topStraightRank - 3, topStraightRank - 2, topStraightRank 	-1 , topStraightRank];
		return _.uniqBy(cards.filter(card => straightRanks.includes(card.rank)),
			card => card.rank);
	}

	private flushFullHand(cards: Card[]): Card[] {
		const flushSuit: CardSuit = _.chain(cards)
			.groupBy(c => c.suit)
			.pickBy(c => c.length >= 5)
			.keys()
			.first();
		
		return this.takeTopN(cards.filter(card => card.suit == flushSuit), 5);
	}

	private boatFullHand(cards: Card[]): Card[] {
		const topTripletRank = _.chain(cards)
			.groupBy(c => c.rank)
			.pickBy(c => c.length === 3)
			.keys()
			.maxBy(card => card.rank);

		const topPairRank = _.chain(cards)
			.filter(card => card.rank != topTripletRank)
			.groupBy(c => c.rank)
			.pickBy(c => c.length === 2)
			.keys()
			.max(card => card.rank);

		return [
			...cards.filter(card => card.rank == topTripletRank),
			 ..._.take(cards.filter(card => card.rank == topPairRank), 2)
		];
	}

	private quadsFullHand(cards: Card[]): Card[] {
		const quadsRank = _.chain(cards)
			.groupBy(c => c.rank)
			.pickBy(c => c.length === 4)
			.keys()
			.first();
		
		const quads = cards.filter(card => card.rank == quadsRank);
		const remainingCards = cards.filter(card => card.rank != quadsRank);

		return [...quads, ...this.takeTopN(remainingCards, 1)];
	}

	private straightFlushFullHand(cards: Card[]): Card[] {
		const flushSuit: CardSuit = _.chain(cards)
			.groupBy(c => c.suit)
			.pickBy(c => c.length >= 5)
			.keys()
			.first()
			.value();

		const straightTopCard = this.BestStraight(cards, flushSuit);

		return [
			new Card(flushSuit, straightTopCard - 4),
			new Card(flushSuit, straightTopCard - 3),
			new Card(flushSuit, straightTopCard - 2),
			new Card(flushSuit, straightTopCard - 1),
			new Card(flushSuit, straightTopCard)
		]
	}

	private royalFlushFullHand(cards: Card[]): Card[] {
		const flushSuit: CardSuit = _.chain(cards)
			.groupBy(c => c.suit)
			.pickBy(c => c.length >= 5)
			.keys()
			.first();

		return [
			new Card(flushSuit, CardRank.Ten),
			new Card(flushSuit, CardRank.Jack),
			new Card(flushSuit, CardRank.Queen),
			new Card(flushSuit, CardRank.King),
			new Card(flushSuit, CardRank.Ace)
		]
	}

	private playerFullHand(cards: Card[]): Card[] {

		const handValue: HandValue = this.HandValue(cards);

		switch (handValue) {
			case HandValue.HighCard:
				return this.highCardFullHand(cards);
				break;
			case HandValue.Pair:
				return this.pairFullHand(cards);
				break;
			case HandValue.TwoPair:
				return this.twoPairFullHand(cards);
				break;
			case HandValue.Triplets:
				return this.TripletFullHand(cards);
				break;
			case HandValue.Straight:
				return this.straightFullHand(cards);
				break;
			case HandValue.Flush:
				return this.flushFullHand(cards);
				break;
			case HandValue.Boat:
				return this.boatFullHand(cards);
				break;
			case HandValue.Quads:
				return this.quadsFullHand(cards);
				break;
			case HandValue.StraightFlush:
				return this.straightFlushFullHand(cards);
				break;
			case HandValue.RoyalFlush:
				return this.royalFlushFullHand(cards);
				break;
			default:
				break;
		}
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
