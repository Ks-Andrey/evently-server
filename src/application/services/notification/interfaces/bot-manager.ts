import { UUID } from 'crypto';

export interface IBotManager {
    sendMessage(userId: UUID, message: string): Promise<void>;
}
