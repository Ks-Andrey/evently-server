import { UUID } from 'crypto';

import { PaginationParams, PaginationResult } from '@application/common';

import { UserDTO } from './dto/user-dto';
import { UserEventDTO } from './dto/user-event-dto';
import { UserListView } from './dto/user-list-view';

export interface IUserReader {
    findUserEvents(
        userId: UUID,
        pagination?: PaginationParams,
        search?: string,
    ): Promise<PaginationResult<UserEventDTO>>;
    findByUsername(username: string): Promise<UserDTO | null>;
    findById(userId: UUID): Promise<UserDTO | null>;
    findAll(): Promise<UserDTO[]>;
    findAllViews(pagination: PaginationParams, search?: string): Promise<PaginationResult<UserListView>>;
}
