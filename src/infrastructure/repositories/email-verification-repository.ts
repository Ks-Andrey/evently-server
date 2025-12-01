import { UUID } from 'crypto';

import { EmailVerificationPurpose } from '@common/constants/email-verification';
import { IEmailVerificationRepository } from '@domain/models/auth';
import { EmailVerification } from '@domain/models/auth';
import { Prisma } from '@generated/prisma/client';

import { prisma } from '../utils/database/prisma-client';

type EmailVerificationData = Prisma.EmailVerificationGetPayload<{}>;

export class EmailVerificationRepository implements IEmailVerificationRepository {
    async findById(id: UUID): Promise<EmailVerification | null> {
        const verificationData = await prisma.emailVerification.findUnique({
            where: { id },
        });

        if (!verificationData) {
            return null;
        }

        return this.toDomain(verificationData);
    }

    async findByEmail(email: string): Promise<EmailVerification | null> {
        const verificationData = await prisma.emailVerification.findFirst({
            where: { email },
            orderBy: { expiresAt: 'desc' },
        });

        if (!verificationData) {
            return null;
        }

        return this.toDomain(verificationData);
    }

    async save(entity: EmailVerification): Promise<void> {
        const verificationData = {
            id: entity.id,
            userId: entity.userId,
            email: entity.email,
            purpose: entity.purpose,
            expiresAt: entity.expiresAt,
            used: entity.isUsed,
        };

        await prisma.emailVerification.upsert({
            where: { id: entity.id },
            create: verificationData,
            update: verificationData,
        });
    }

    async delete(id: UUID): Promise<void> {
        await prisma.emailVerification.delete({
            where: { id },
        });
    }

    private toDomain(verificationData: EmailVerificationData): EmailVerification {
        return EmailVerification.create(
            verificationData.id as UUID,
            verificationData.userId as UUID,
            verificationData.email,
            verificationData.purpose as EmailVerificationPurpose,
            verificationData.expiresAt,
        );
    }
}
