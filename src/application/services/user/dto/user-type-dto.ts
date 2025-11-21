import { UUID } from 'crypto';

export class UserTypeDTO {
    private constructor(
        readonly userTypeId: UUID,
        readonly typeName: string,
    ) {}
}
