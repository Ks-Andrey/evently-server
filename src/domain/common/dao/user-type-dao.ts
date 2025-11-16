import { UUID } from 'crypto';

import { UserType } from '../../user';

export interface IUserTypeDao {
    findById(id: UUID): Promise<UserType>;
}
