export class LogoutResult {
    private constructor(
        readonly success: boolean,
        readonly message: string,
    ) {}

    static create(): LogoutResult {
        return new LogoutResult(true, 'Logged out successfully');
    }
}
