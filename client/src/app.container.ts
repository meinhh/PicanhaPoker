import { container } from 'inversify-props';

import IBotsApiAccessor from '@/services/botsApiAccessor/IBotsApiAccessor';
import BotsApiAccessorService from '@/services/botsApiAccessor/BotApiAccessor.service';

export default function buildDependencyContainer (): void {
    container.addTransient<IBotsApiAccessor>(BotsApiAccessorService);
}