import { UUID } from 'crypto';

import { ICommentRepository } from '@domain/models/comment';
import { Comment } from '@domain/models/comment';
import { CommentUser } from '@domain/models/comment/entities/comment-user';
import { Prisma } from '@generated/prisma/client';

import { PrismaUnitOfWork } from '../database/unit-of-work';

type CommentWithAuthor = Prisma.CommentGetPayload<{
    include: { author: true };
}>;

export class CommentRepository implements ICommentRepository {
    constructor(private readonly unitOfWork: PrismaUnitOfWork) {}

    private get prisma() {
        return this.unitOfWork.getClient();
    }

    async findById(id: UUID): Promise<Comment | null> {
        const commentData = await this.prisma.comment.findUnique({
            where: { id },
            include: { author: true },
        });

        if (!commentData) {
            return null;
        }

        return this.toDomain(commentData);
    }

    async save(entity: Comment): Promise<void> {
        const author = entity.author;
        const commentData = {
            id: entity.id,
            eventId: entity.eventId,
            authorId: author.id,
            text: entity.text,
            createdAt: entity.createdAt,
        };

        await this.prisma.comment.upsert({
            where: { id: entity.id },
            create: commentData,
            update: commentData,
        });
    }

    async delete(id: UUID): Promise<void> {
        await this.prisma.comment.delete({
            where: { id },
        });
    }

    private toDomain(commentData: CommentWithAuthor): Comment {
        const author = CommentUser.create(commentData.author.id as UUID, commentData.author.username);
        return Comment.create(
            commentData.id as UUID,
            commentData.eventId as UUID,
            author,
            commentData.text,
            commentData.createdAt,
        );
    }
}
