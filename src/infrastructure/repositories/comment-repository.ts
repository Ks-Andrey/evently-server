import { UUID } from 'crypto';

import { IUnitOfWork } from '@common/types/unit-of-work';
import { ICommentRepository, Comment, CommentUser } from '@domain/social/comment';
import { Prisma } from '@generated/prisma/client';

type CommentWithAuthor = Prisma.CommentGetPayload<{
    include: { author: true };
}>;

export class CommentRepository implements ICommentRepository {
    constructor(private readonly unitOfWork: IUnitOfWork) {}

    async findById(id: UUID): Promise<Comment | null> {
        const client = this.unitOfWork.getClient();
        const commentData = await client.comment.findUnique({
            where: { id },
            include: { author: true },
        });

        if (!commentData) {
            return null;
        }

        return this.toDomain(commentData);
    }

    async save(entity: Comment): Promise<void> {
        const client = this.unitOfWork.getClient();
        const author = entity.author;
        const commentData = {
            id: entity.id,
            eventId: entity.eventId,
            authorId: author.id,
            text: entity.text,
            createdAt: entity.createdAt,
        };

        await client.comment.upsert({
            where: { id: entity.id },
            create: commentData,
            update: commentData,
        });
    }

    async delete(id: UUID): Promise<void> {
        const client = this.unitOfWork.getClient();
        await client.comment.delete({
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
