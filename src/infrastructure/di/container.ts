import { asClass, createContainer, InjectionMode } from 'awilix';

import {
    AuthController,
    UserController,
    EventController,
    CategoryController,
    CommentController,
    NotificationController,
    UserTypeController,
    GeocoderController,
} from '@api/controllers';
import { AuthenticateUserHandler, ConfirmUserEmailHandler } from '@application/services/auth';
import {
    CreateCategoryHandler,
    EditCategoryHandler,
    DeleteCategoryHandler,
    FindCategoriesHandler,
} from '@application/services/category';
import {
    CreateCommentHandler,
    EditCommentHandler,
    DeleteCommentHandler,
    FindAllCommentsHandler,
    FindCommentsByEventHandler,
    FindCommentsByUserHandler,
} from '@application/services/comment';
import {
    CreateEventHandler,
    EditEventDetailsHandler,
    DeleteEventHandler,
    AddEventGalleryPhotosHandler,
    DeleteEventGalleryPhotoHandler,
    FindEventsHandler,
    FindEventByIdHandler,
    FindOrganizerEventsHandler,
    FindEventSubscribersHandler,
} from '@application/services/event';
import { FindCoordinatesByLocationHandler } from '@application/services/geocoder';
import { NotifyEventSubscribersHandler, FindUserNotificationsHandler } from '@application/services/notification';
import {
    CreateUserHandler,
    EditUserHandler,
    EditUserEmailHandler,
    EditUserPasswordHandler,
    DeleteUserHandler,
    ToggleBlockUserHandler,
    SubscribeUserToEventHandler,
    UnsubscribeUserFromEventHandler,
    UploadUserAvatarHandler,
    DeleteUserAvatarHandler,
    FindAllUsersHandler,
    FindUserByIdHandler,
    FindUserByNameHandler,
    FindUserByEmailHandler,
    FindUserSubscriptionsHandler,
} from '@application/services/user';
import {
    CreateUserTypeHandler,
    EditUserTypeHandler,
    DeleteUserTypeHandler,
    FindUserTypesHandler,
    FindUserTypeByIdHandler,
} from '@application/services/user-type';
import { TokenManager, BotManager, EmailManager, FileStorageManager, GeocoderManager } from '@infrastructure/managers';
import {
    UserReader,
    EventReader,
    CategoryReader,
    CommentReader,
    NotificationReader,
    UserTypeReader,
} from '@infrastructure/queries';
import {
    UserRepository,
    EventRepository,
    CategoryRepository,
    CommentRepository,
    NotificationRepository,
    UserTypeRepository,
    EmailVerificationRepository,
    EventSubscriptionRepository,
} from '@infrastructure/repositories';
import { PrismaUnitOfWork } from '@infrastructure/utils';

export interface Container {
    unitOfWork: PrismaUnitOfWork;

    // Readers
    userReader: UserReader;
    eventReader: EventReader;
    categoryReader: CategoryReader;
    commentReader: CommentReader;
    notificationReader: NotificationReader;
    userTypeReader: UserTypeReader;

    // Repositories
    userRepository: UserRepository;
    eventRepository: EventRepository;
    categoryRepository: CategoryRepository;
    commentRepository: CommentRepository;
    notificationRepository: NotificationRepository;
    userTypeRepository: UserTypeRepository;
    emailVerificationRepository: EmailVerificationRepository;
    eventSubscriptionRepository: EventSubscriptionRepository;

    // Managers
    tokenManager: TokenManager;
    emailManager: EmailManager;
    fileStorageManager: FileStorageManager;
    botManager: BotManager;
    geocoderManager: GeocoderManager;

    // Auth Handlers
    authenticateUserHandler: AuthenticateUserHandler;
    confirmUserEmailHandler: ConfirmUserEmailHandler;

    // User Handlers
    createUserHandler: CreateUserHandler;
    editUserHandler: EditUserHandler;
    editUserEmailHandler: EditUserEmailHandler;
    editUserPasswordHandler: EditUserPasswordHandler;
    deleteUserHandler: DeleteUserHandler;
    toggleBlockUserHandler: ToggleBlockUserHandler;
    subscribeUserToEventHandler: SubscribeUserToEventHandler;
    unsubscribeUserFromEventHandler: UnsubscribeUserFromEventHandler;
    uploadUserAvatarHandler: UploadUserAvatarHandler;
    deleteUserAvatarHandler: DeleteUserAvatarHandler;
    findAllUsersHandler: FindAllUsersHandler;
    findUserByIdHandler: FindUserByIdHandler;
    findUserByNameHandler: FindUserByNameHandler;
    findUserByEmailHandler: FindUserByEmailHandler;
    findUserSubscriptionsHandler: FindUserSubscriptionsHandler;

    // Event Handlers
    createEventHandler: CreateEventHandler;
    editEventDetailsHandler: EditEventDetailsHandler;
    deleteEventHandler: DeleteEventHandler;
    addEventGalleryPhotosHandler: AddEventGalleryPhotosHandler;
    deleteEventGalleryPhotoHandler: DeleteEventGalleryPhotoHandler;
    findEventsHandler: FindEventsHandler;
    findEventByIdHandler: FindEventByIdHandler;
    findOrganizerEventsHandler: FindOrganizerEventsHandler;
    findEventSubscribersHandler: FindEventSubscribersHandler;

    // Category Handlers
    createCategoryHandler: CreateCategoryHandler;
    editCategoryHandler: EditCategoryHandler;
    deleteCategoryHandler: DeleteCategoryHandler;
    findCategoriesHandler: FindCategoriesHandler;

    // Comment Handlers
    createCommentHandler: CreateCommentHandler;
    editCommentHandler: EditCommentHandler;
    deleteCommentHandler: DeleteCommentHandler;
    findAllCommentsHandler: FindAllCommentsHandler;
    findCommentsByEventHandler: FindCommentsByEventHandler;
    findCommentsByUserHandler: FindCommentsByUserHandler;

    // Notification Handlers
    notifyEventSubscribersHandler: NotifyEventSubscribersHandler;
    findUserNotificationsHandler: FindUserNotificationsHandler;

    // UserType Handlers
    createUserTypeHandler: CreateUserTypeHandler;
    editUserTypeHandler: EditUserTypeHandler;
    deleteUserTypeHandler: DeleteUserTypeHandler;
    findUserTypesHandler: FindUserTypesHandler;
    findUserTypeByIdHandler: FindUserTypeByIdHandler;

    // Geocoder Handlers
    findCoordinatesByLocationHandler: FindCoordinatesByLocationHandler;

    // Controllers
    authController: AuthController;
    userController: UserController;
    eventController: EventController;
    categoryController: CategoryController;
    commentController: CommentController;
    notificationController: NotificationController;
    userTypeController: UserTypeController;
    geocoderController: GeocoderController;
}

export function createDIContainer() {
    const container = createContainer<Container>({
        injectionMode: InjectionMode.CLASSIC,
    });

    // Infrastructure Layer
    container.register({
        unitOfWork: asClass(PrismaUnitOfWork).singleton(),
    });

    // Readers
    container.register({
        userReader: asClass(UserReader).singleton(),
        eventReader: asClass(EventReader).singleton(),
        categoryReader: asClass(CategoryReader).singleton(),
        commentReader: asClass(CommentReader).singleton(),
        notificationReader: asClass(NotificationReader).singleton(),
        userTypeReader: asClass(UserTypeReader).singleton(),
    });

    // Repositories
    container.register({
        userRepository: asClass(UserRepository).singleton(),
        eventRepository: asClass(EventRepository).singleton(),
        categoryRepository: asClass(CategoryRepository).singleton(),
        commentRepository: asClass(CommentRepository).singleton(),
        notificationRepository: asClass(NotificationRepository).singleton(),
        userTypeRepository: asClass(UserTypeRepository).singleton(),
        emailVerificationRepository: asClass(EmailVerificationRepository).singleton(),
        eventSubscriptionRepository: asClass(EventSubscriptionRepository).singleton(),
    });

    // Managers
    container.register({
        tokenManager: asClass(TokenManager).singleton(),
        emailManager: asClass(EmailManager).singleton(),
        fileStorageManager: asClass(FileStorageManager).singleton(),
        botManager: asClass(BotManager).singleton(),
        geocoderManager: asClass(GeocoderManager).singleton(),
    });

    // Auth Handlers
    container.register({
        authenticateUserHandler: asClass(AuthenticateUserHandler)
            .inject((container) => ({
                userRepo: container.resolve('userRepository'),
                tokenManager: container.resolve('tokenManager'),
            }))
            .singleton(),
        confirmUserEmailHandler: asClass(ConfirmUserEmailHandler)
            .inject((container) => ({
                userRepo: container.resolve('userRepository'),
                emailVerificationRepo: container.resolve('emailVerificationRepository'),
                unitOfWork: container.resolve('unitOfWork'),
            }))
            .singleton(),
    });

    // User Handlers
    container.register({
        createUserHandler: asClass(CreateUserHandler)
            .inject((container) => ({
                userRepo: container.resolve('userRepository'),
                userTypeRepo: container.resolve('userTypeRepository'),
                emailVerificationRepo: container.resolve('emailVerificationRepository'),
                emailService: container.resolve('emailManager'),
                unitOfWork: container.resolve('unitOfWork'),
            }))
            .singleton(),
        editUserHandler: asClass(EditUserHandler)
            .inject((container) => ({
                userRepo: container.resolve('userRepository'),
            }))
            .singleton(),
        editUserEmailHandler: asClass(EditUserEmailHandler)
            .inject((container) => ({
                userRepo: container.resolve('userRepository'),
                emailVerificationRepo: container.resolve('emailVerificationRepository'),
                emailService: container.resolve('emailManager'),
                unitOfWork: container.resolve('unitOfWork'),
            }))
            .singleton(),
        editUserPasswordHandler: asClass(EditUserPasswordHandler)
            .inject((container) => ({
                userRepo: container.resolve('userRepository'),
            }))
            .singleton(),
        deleteUserHandler: asClass(DeleteUserHandler)
            .inject((container) => ({
                userRepo: container.resolve('userRepository'),
            }))
            .singleton(),
        toggleBlockUserHandler: asClass(ToggleBlockUserHandler)
            .inject((container) => ({
                userRepo: container.resolve('userRepository'),
            }))
            .singleton(),
        subscribeUserToEventHandler: asClass(SubscribeUserToEventHandler)
            .inject((container) => ({
                userRepo: container.resolve('userRepository'),
                eventRepo: container.resolve('eventRepository'),
                subscriptionRepo: container.resolve('eventSubscriptionRepository'),
                unitOfWork: container.resolve('unitOfWork'),
            }))
            .singleton(),
        unsubscribeUserFromEventHandler: asClass(UnsubscribeUserFromEventHandler)
            .inject((container) => ({
                userRepo: container.resolve('userRepository'),
                eventRepo: container.resolve('eventRepository'),
                subscriptionRepo: container.resolve('eventSubscriptionRepository'),
                unitOfWork: container.resolve('unitOfWork'),
            }))
            .singleton(),
        uploadUserAvatarHandler: asClass(UploadUserAvatarHandler)
            .inject((container) => ({
                userRepo: container.resolve('userRepository'),
                fileStorageManager: container.resolve('fileStorageManager'),
                unitOfWork: container.resolve('unitOfWork'),
            }))
            .singleton(),
        deleteUserAvatarHandler: asClass(DeleteUserAvatarHandler)
            .inject((container) => ({
                userRepo: container.resolve('userRepository'),
                fileStorageManager: container.resolve('fileStorageManager'),
                unitOfWork: container.resolve('unitOfWork'),
            }))
            .singleton(),
        findAllUsersHandler: asClass(FindAllUsersHandler).singleton(),
        findUserByIdHandler: asClass(FindUserByIdHandler).singleton(),
        findUserByNameHandler: asClass(FindUserByNameHandler).singleton(),
        findUserByEmailHandler: asClass(FindUserByEmailHandler).singleton(),
        findUserSubscriptionsHandler: asClass(FindUserSubscriptionsHandler).singleton(),
    });

    // Event Handlers
    container.register({
        createEventHandler: asClass(CreateEventHandler)
            .inject((container) => ({
                eventRepo: container.resolve('eventRepository'),
                categoryReader: container.resolve('categoryReader'),
                userReader: container.resolve('userReader'),
            }))
            .singleton(),
        editEventDetailsHandler: asClass(EditEventDetailsHandler)
            .inject((container) => ({
                eventRepo: container.resolve('eventRepository'),
                userRepo: container.resolve('userReader'),
                categoryRepo: container.resolve('categoryReader'),
            }))
            .singleton(),
        deleteEventHandler: asClass(DeleteEventHandler)
            .inject((container) => ({
                userReader: container.resolve('userReader'),
                eventRepo: container.resolve('eventRepository'),
            }))
            .singleton(),
        addEventGalleryPhotosHandler: asClass(AddEventGalleryPhotosHandler)
            .inject((container) => ({
                eventRepo: container.resolve('eventRepository'),
                fileStorageManager: container.resolve('fileStorageManager'),
                unitOfWork: container.resolve('unitOfWork'),
            }))
            .singleton(),
        deleteEventGalleryPhotoHandler: asClass(DeleteEventGalleryPhotoHandler)
            .inject((container) => ({
                eventRepo: container.resolve('eventRepository'),
                fileStorageManager: container.resolve('fileStorageManager'),
                unitOfWork: container.resolve('unitOfWork'),
            }))
            .singleton(),
        findEventsHandler: asClass(FindEventsHandler).singleton(),
        findEventByIdHandler: asClass(FindEventByIdHandler).singleton(),
        findOrganizerEventsHandler: asClass(FindOrganizerEventsHandler).singleton(),
        findEventSubscribersHandler: asClass(FindEventSubscribersHandler).singleton(),
    });

    // Category Handlers
    container.register({
        createCategoryHandler: asClass(CreateCategoryHandler)
            .inject((container) => ({
                categoryReader: container.resolve('categoryReader'),
                categoryRepo: container.resolve('categoryRepository'),
            }))
            .singleton(),
        editCategoryHandler: asClass(EditCategoryHandler)
            .inject((container) => ({
                categoryRepo: container.resolve('categoryRepository'),
            }))
            .singleton(),
        deleteCategoryHandler: asClass(DeleteCategoryHandler)
            .inject((container) => ({
                categoryRepo: container.resolve('categoryRepository'),
                eventReader: container.resolve('eventReader'),
            }))
            .singleton(),
        findCategoriesHandler: asClass(FindCategoriesHandler).singleton(),
    });

    // Comment Handlers
    container.register({
        createCommentHandler: asClass(CreateCommentHandler)
            .inject((container) => ({
                commentRepo: container.resolve('commentRepository'),
                eventRepo: container.resolve('eventRepository'),
                userRepo: container.resolve('userRepository'),
                unitOfWork: container.resolve('unitOfWork'),
            }))
            .singleton(),
        editCommentHandler: asClass(EditCommentHandler)
            .inject((container) => ({
                userRepo: container.resolve('userRepository'),
                commentRepo: container.resolve('commentRepository'),
            }))
            .singleton(),
        deleteCommentHandler: asClass(DeleteCommentHandler)
            .inject((container) => ({
                userRepo: container.resolve('userRepository'),
                commentRepo: container.resolve('commentRepository'),
                eventRepo: container.resolve('eventRepository'),
                unitOfWork: container.resolve('unitOfWork'),
            }))
            .singleton(),
        findAllCommentsHandler: asClass(FindAllCommentsHandler).singleton(),
        findCommentsByEventHandler: asClass(FindCommentsByEventHandler).singleton(),
        findCommentsByUserHandler: asClass(FindCommentsByUserHandler).singleton(),
    });

    // Notification Handlers
    container.register({
        notifyEventSubscribersHandler: asClass(NotifyEventSubscribersHandler)
            .inject((container) => ({
                eventReader: container.resolve('eventReader'),
                notificationRepo: container.resolve('notificationRepository'),
                unitOfWork: container.resolve('unitOfWork'),
                botManager: container.resolve('botManager'),
            }))
            .singleton(),
        findUserNotificationsHandler: asClass(FindUserNotificationsHandler).singleton(),
    });

    // UserType Handlers
    container.register({
        createUserTypeHandler: asClass(CreateUserTypeHandler)
            .inject((container) => ({
                userTypeReader: container.resolve('userTypeReader'),
                userTypeRepo: container.resolve('userTypeRepository'),
            }))
            .singleton(),
        editUserTypeHandler: asClass(EditUserTypeHandler)
            .inject((container) => ({
                userTypeRepo: container.resolve('userTypeRepository'),
            }))
            .singleton(),
        deleteUserTypeHandler: asClass(DeleteUserTypeHandler)
            .inject((container) => ({
                userTypeRepo: container.resolve('userTypeRepository'),
                userReader: container.resolve('userReader'),
            }))
            .singleton(),
        findUserTypesHandler: asClass(FindUserTypesHandler).singleton(),
        findUserTypeByIdHandler: asClass(FindUserTypeByIdHandler).singleton(),
    });

    // Geocoder Handlers
    container.register({
        findCoordinatesByLocationHandler: asClass(FindCoordinatesByLocationHandler)
            .inject((container) => ({
                geocoderManager: container.resolve('geocoderManager'),
            }))
            .singleton(),
    });

    // Controllers
    container.register({
        authController: asClass(AuthController).singleton(),
        userController: asClass(UserController).singleton(),
        eventController: asClass(EventController).singleton(),
        categoryController: asClass(CategoryController).singleton(),
        commentController: asClass(CommentController).singleton(),
        notificationController: asClass(NotificationController).singleton(),
        userTypeController: asClass(UserTypeController).singleton(),
        geocoderController: asClass(GeocoderController)
            .inject((container) => ({
                findCoordinatesByLocationHandler: container.resolve('findCoordinatesByLocationHandler'),
            }))
            .singleton(),
    });

    return container;
}

export interface AppDependencies {
    tokenManager: TokenManager;
    authController: AuthController;
    userController: UserController;
    eventController: EventController;
    categoryController: CategoryController;
    commentController: CommentController;
    notificationController: NotificationController;
    userTypeController: UserTypeController;
    geocoderController: GeocoderController;
}

export function getAppDependencies(container: ReturnType<typeof createDIContainer>): AppDependencies {
    return {
        tokenManager: container.resolve('tokenManager'),
        authController: container.resolve('authController'),
        userController: container.resolve('userController'),
        eventController: container.resolve('eventController'),
        categoryController: container.resolve('categoryController'),
        commentController: container.resolve('commentController'),
        notificationController: container.resolve('notificationController'),
        userTypeController: container.resolve('userTypeController'),
        geocoderController: container.resolve('geocoderController'),
    };
}
