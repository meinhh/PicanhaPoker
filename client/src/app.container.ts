import { container } from 'inversify-props';
import "reflect-metadata";

import IBotsApiAccessor from '@/services/botsApiAccessor/IBotsApiAccessor';
import BotsApiAccessorService from '@/services/botsApiAccessor/BotApiAccessor.service';

export default function buildDependencyContainer (): void {
    container.addSingleton<IBotsApiAccessor>(BotsApiAccessorService, 'BotsAccessor');
}