export interface IUnitOfWork {
    execute<T>(fn: () => Promise<T>): Promise<T>;

    begin(): Promise<void>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
}
