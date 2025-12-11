import { UUID } from 'crypto';

import { PaginationParams, PaginationResult, createPaginationResult } from '@application/common';
import { ICommentReader, CommentDTO, CommentUserDTO } from '@application/readers/comment';
import { UPLOAD_DIRECTORIES } from '@common/constants/file-upload';
import { getImageUrl } from '@common/utils/image-url';
import { Prisma } from '@prisma/client';

import { prisma } from '../utils';

type CommentWithAuthor = Prisma.CommentGetPayload<{
    include: { author: true };
}>;

export class CommentReader implements ICommentReader {
    async findAll(pagination: PaginationParams, dateFrom?: Date, dateTo?: Date): Promise<PaginationResult<CommentDTO>> {
        const page = pagination.page;
        const pageSize = pagination.pageSize;
        const skip = (page - 1) * pageSize;

        const where: Prisma.CommentWhereInput = {};
        if (dateFrom || dateTo) {
            where.createdAt = {};
            if (dateFrom) {
                where.createdAt.gte = dateFrom;
            }
            if (dateTo) {
                where.createdAt.lte = dateTo;
            }
        }

        const [commentsData, total] = await Promise.all([
            prisma.comment.findMany({
                where,
                include: { author: true },
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.comment.count({ where }),
        ]);

        const data = commentsData.map((commentData) => this.toCommentDTO(commentData));

        return createPaginationResult(data, total, page, pageSize);
    }

    async findById(commentId: UUID): Promise<CommentDTO | null> {
        const commentData = await prisma.comment.findUnique({
            where: { id: commentId },
            include: { author: true },
        });

        if (!commentData) {
            return null;
        }

        return this.toCommentDTO(commentData);
    }

    async findCommentsByEventId(
        eventId: UUID,
        pagination: PaginationParams,
        dateFrom?: Date,
        dateTo?: Date,
    ): Promise<PaginationResult<CommentDTO>> {
        const page = pagination.page;
        const pageSize = pagination.pageSize;
        const skip = (page - 1) * pageSize;

        const where: Prisma.CommentWhereInput = { eventId };
        if (dateFrom || dateTo) {
            where.createdAt = {};
            if (dateFrom) {
                where.createdAt.gte = dateFrom;
            }
            if (dateTo) {
                where.createdAt.lte = dateTo;
            }
        }

        const [commentsData, total] = await Promise.all([
            prisma.comment.findMany({
                where,
                include: { author: true },
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.comment.count({ where }),
        ]);

        const data = commentsData.map((commentData) => this.toCommentDTO(commentData));

        return createPaginationResult(data, total, page, pageSize);
    }

    async findAllCommentsByUserId(
        userId: UUID,
        pagination: PaginationParams,
        dateFrom?: Date,
        dateTo?: Date,
    ): Promise<PaginationResult<CommentDTO>> {
        const page = pagination.page;
        const pageSize = pagination.pageSize;
        const skip = (page - 1) * pageSize;

        const where: Prisma.CommentWhereInput = { authorId: userId };
        if (dateFrom || dateTo) {
            where.createdAt = {};
            if (dateFrom) {
                where.createdAt.gte = dateFrom;
            }
            if (dateTo) {
                where.createdAt.lte = dateTo;
            }
        }

        const [commentsData, total] = await Promise.all([
            prisma.comment.findMany({
                where,
                include: { author: true },
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.comment.count({ where }),
        ]);

        const data = commentsData.map((commentData) => this.toCommentDTO(commentData));

        return createPaginationResult(data, total, page, pageSize);
    }

    private toCommentDTO(commentData: CommentWithAuthor): CommentDTO {
        const authorDTO = CommentUserDTO.create(
            commentData.author.id as UUID,
            commentData.author.username,
            commentData.author.imageUrl
                ? getImageUrl(commentData.author.imageUrl, UPLOAD_DIRECTORIES.AVATARS)
                : undefined,
        );

        return CommentDTO.create(commentData.id as UUID, authorDTO, commentData.text, commentData.createdAt);
    }
}
