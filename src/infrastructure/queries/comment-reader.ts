import { UUID } from 'crypto';

import { ICommentReader, CommentDTO, CommentUserDTO } from '@application/readers/comment';
import { Prisma } from '@generated/prisma/client';

import { prisma } from '../utils';

type CommentWithAuthor = Prisma.CommentGetPayload<{
    include: { author: true };
}>;

export class CommentReader implements ICommentReader {
    async findAll(): Promise<CommentDTO[]> {
        const commentsData = await prisma.comment.findMany({
            include: { author: true },
        });

        return commentsData.map((commentData) => this.toCommentDTO(commentData));
    }

    async findCommentsByEventId(eventId: UUID): Promise<CommentDTO[]> {
        const commentsData = await prisma.comment.findMany({
            where: { eventId },
            include: { author: true },
            orderBy: { createdAt: 'desc' },
        });

        return commentsData.map((commentData) => this.toCommentDTO(commentData));
    }

    async findAllCommentsByUserId(userId: UUID): Promise<CommentDTO[]> {
        const commentsData = await prisma.comment.findMany({
            where: { authorId: userId },
            include: { author: true },
            orderBy: { createdAt: 'desc' },
        });

        return commentsData.map((commentData) => this.toCommentDTO(commentData));
    }

    private toCommentDTO(commentData: CommentWithAuthor): CommentDTO {
        const authorDTO = CommentUserDTO.create(
            commentData.author.id as UUID,
            commentData.author.username,
            commentData.author.imageUrl || undefined,
        );

        return CommentDTO.create(
            commentData.id as UUID,
            commentData.eventId as UUID,
            authorDTO,
            commentData.text,
            commentData.createdAt,
        );
    }
}
