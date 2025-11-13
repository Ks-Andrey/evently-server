import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const hash = (password: string): Promise<string> => {
    return bcrypt.hash(password, SALT_ROUNDS);
};

export const compare = (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
};
