import { UUID } from 'crypto';

import { UserDTO } from './dto/user-dto';
import { UserEventDTO } from './dto/user-event-dto';
import { UserListView } from './dto/user-list-view';

export interface IUserReader {
    findUserEvents(userId: UUID): Promise<UserEventDTO[]>;
    findByUsername(username: string): Promise<UserDTO | null>;
    findById(userId: UUID): Promise<UserDTO | null>;
    findAll(): Promise<UserDTO[]>;
    findAllViews(): Promise<UserListView[]>;
}
