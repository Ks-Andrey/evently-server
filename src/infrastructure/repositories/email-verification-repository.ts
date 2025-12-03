import { UUID } from 'crypto';

import { IUnitOfWork } from '@common/types/unit-of-work';
import { IEmailVerificationRepository, EmailVerification } from '@domain/identity/auth';
import { Prisma } from '@prisma/client';

type EmailVerificationData = Prisma.EmailVerificationGetPayload<{}>;

export class EmailVerificationRepository implements IEmailVerificationRepository {
    constructor(private readonly unitOfWork: IUnitOfWork) {}

    async findById(id: UUID): Promise<EmailVerification | null> {
        const client = this.unitOfWork.getClient();
        const verificationData = await client.emailVerification.findUnique({
            where: { id },
        });

        if (!verificationData) {
            return null;
        }

        return this.toDomain(verificationData);
    }

    async findByEmail(email: string): Promise<EmailVerification | null> {
        const client = this.unitOfWork.getClient();
        const normalizedEmail = email.trim();
        const verificationData = await client.emailVerification.findFirst({
            where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
            orderBy: { expiresAt: 'desc' },
        });

        if (!verificationData) {
            return null;
        }

        return this.toDomain(verificationData);
    }

    async save(entity: EmailVerification): Promise<void> {
        const client = this.unitOfWork.getClient();
        const verificationData = {
            id: entity.id,
            userId: entity.userId,
            email: entity.email,
            purpose: entity.purpose,
            expiresAt: entity.expiresAt,
            used: entity.isUsed,
        };

        await client.emailVerification.upsert({
            where: { id: entity.id },
            create: verificationData,
            update: verificationData,
        });
    }

    async delete(id: UUID): Promise<void> {
        const client = this.unitOfWork.getClient();
        await client.emailVerification.delete({
            where: { id },
        });
    }

    private toDomain(verificationData: EmailVerificationData): EmailVerification {
        return EmailVerification.create(
            verificationData.id as UUID,
            verificationData.userId as UUID,
            verificationData.email,
            verificationData.purpose,
            verificationData.expiresAt,
        );
    }
}
