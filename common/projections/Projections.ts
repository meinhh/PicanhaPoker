import Reducer from "./Reducer";
import { Event } from "../game/Events";

export default class Projector<T> implements Projector<T> {
    public constructor(private readonly reducer: Reducer<T>) {}

    public project(hand: Event[]): T {
        let value = this.reducer.intial();
        for (const event of hand) {
            value = this.reducer.apply(value, event);
        }
        return value;
    }
}
