export const MESSAGES = {
    result: {
        event: {
            created: 'Событие успешно создано',
            updated: 'Событие успешно обновлено',
            deleted: 'Событие успешно удалено',
            galleryPhotoDeleted: 'Фото из галереи успешно удалено',
            galleryPhotosAdded: (count: number) => `${count} фото успешно добавлено в галерею`,
        },
        user: {
            created: 'Пользователь успешно создан',
            updated: 'Пользователь успешно обновлен',
            deleted: 'Пользователь успешно удален',
            passwordUpdated: 'Пароль успешно обновлен',
            emailUpdated: 'Запрос на изменение email отправлен. Пожалуйста, проверьте новый email для подтверждения',
            avatarUploaded: 'Аватар успешно загружен',
            avatarDeleted: 'Аватар успешно удален',
            blocked: 'Пользователь успешно заблокирован',
            unblocked: 'Пользователь успешно разблокирован',
        },
        category: {
            created: 'Категория успешно создана',
            updated: 'Категория успешно обновлена',
            deleted: 'Категория успешно удалена',
        },
        comment: {
            created: 'Комментарий успешно создан',
            updated: 'Комментарий успешно обновлен',
            deleted: 'Комментарий успешно удален',
        },
        userType: {
            created: 'Тип пользователя успешно создан',
            updated: 'Тип пользователя успешно обновлен',
            deleted: 'Тип пользователя успешно удален',
        },
        auth: {
            loggedOut: 'Выход выполнен успешно',
            emailConfirmed: 'Email успешно подтвержден',
        },
        subscription: {
            subscribed: 'Подписка на событие успешно оформлена',
            unsubscribed: 'Подписка на событие успешно отменена',
        },
        notification: {
            subscribersNotified: (count: number) => `${count} подписчик(ов) успешно уведомлено`,
            remindersSent: (totalNotified: number, eventsCount: number) =>
                `Отправлено ${totalNotified} напоминаний для ${eventsCount} событий`,
        },
    },
    notification: {
        eventUpdated: (eventTitle: string) => `Событие "${eventTitle}" было обновлено. Проверьте изменения!`,
        eventReminder: (eventTitle: string, location: string) =>
            `Напоминание: событие "${eventTitle}" начнется через час! Место: ${location}`,
    },
} as const;
