export const fileSizeLimits = {
    AVATAR_MAX_SIZE: 5 * 1024 * 1024,
    GALLERY_IMAGE_MAX_SIZE: 10 * 1024 * 1024,
} as const;

export const allowedMimeTypes = {
    AVATAR: ['image/jpeg', 'image/png', 'image/webp'] as const,
    GALLERY: ['image/jpeg', 'image/png', 'image/webp'] as const,
} as const;

export const imageDimensions = {
    AVATAR_MAX_WIDTH: 1024,
    AVATAR_MAX_HEIGHT: 1024,
    GALLERY_MAX_WIDTH: 2048,
    GALLERY_MAX_HEIGHT: 2048,
} as const;

export const galleryMaxPhotos = 10;

export const allowedExtensions = {
    AVATAR: ['.jpg', '.jpeg', '.png', '.webp'] as const,
    GALLERY: ['.jpg', '.jpeg', '.png', '.webp'] as const,
} as const;
