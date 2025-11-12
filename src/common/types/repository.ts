import { UUID } from 'crypto';

export interface IRepository<T> {
    findById(id: UUID): Promise<T | null>;
    save(entity: T): Promise<void>;
    delete(id: UUID): Promise<void>;
}
