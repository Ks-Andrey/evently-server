export const FILE_SIZE_LIMITS = {
    AVATAR_MAX_SIZE: 5 * 1024 * 1024,
    GALLERY_IMAGE_MAX_SIZE: 10 * 1024 * 1024,
};

export const ALLOWED_MIME_TYPES = {
    AVATAR: ['image/jpeg', 'image/png', 'image/webp'],
    GALLERY: ['image/jpeg', 'image/png', 'image/webp'],
};

export const IMAGE_DIMENSIONS = {
    AVATAR_MAX_WIDTH: 1024,
    AVATAR_MAX_HEIGHT: 1024,
    GALLERY_MAX_WIDTH: 2048,
    GALLERY_MAX_HEIGHT: 2048,
};

export const GALLERY_MAX_PHOTOS = 10;

export const allowedExtensions = {
    AVATAR: ['.jpg', '.jpeg', '.png', '.webp'],
    GALLERY: ['.jpg', '.jpeg', '.png', '.webp'],
};

export const UPLOAD_DIRECTORIES = {
    AVATARS: 'avatars',
    EVENTS: 'events',
};
