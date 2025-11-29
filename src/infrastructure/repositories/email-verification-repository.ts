import { UUID } from 'crypto';

import { IEmailVerificationRepository } from '@domain/models/auth';
import { EmailVerification, EmailVerificationPurpose } from '@domain/models/auth';
import { Prisma } from '@generated/prisma/client';

import { PrismaUnitOfWork } from '../database/unit-of-work';

type EmailVerificationData = Prisma.EmailVerificationGetPayload<{}>;

export class EmailVerificationRepository implements IEmailVerificationRepository {
    constructor(private readonly unitOfWork: PrismaUnitOfWork) {}

    private get prisma() {
        return this.unitOfWork.getClient();
    }

    async findById(id: UUID): Promise<EmailVerification | null> {
        const verificationData = await this.prisma.emailVerification.findUnique({
            where: { id },
        });

        if (!verificationData) {
            return null;
        }

        return this.toDomain(verificationData);
    }

    async findByEmail(email: string): Promise<EmailVerification | null> {
        const verificationData = await this.prisma.emailVerification.findFirst({
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

        await this.prisma.emailVerification.upsert({
            where: { id: entity.id },
            create: verificationData,
            update: verificationData,
        });
    }

    async delete(id: UUID): Promise<void> {
        await this.prisma.emailVerification.delete({
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
