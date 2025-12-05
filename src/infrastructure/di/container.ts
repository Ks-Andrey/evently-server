import { asClass, createContainer, InjectionMode, AwilixContainer } from 'awilix';

import {
    AuthController,
    UserController,
    EventController,
    CategoryController,
    CommentController,
    NotificationController,
    UserTypeController,
    GeocoderController,
    StatisticsController,
} from '@api/controllers';
import {
    AuthenticateUserHandler,
    ConfirmUserEmailHandler,
    RefreshTokensHandler,
    LogoutUserHandler,
} from '@application/services/auth';
import {
    CreateCategoryHandler,
    EditCategoryHandler,
    DeleteCategoryHandler,
    FindCategoriesHandler,
    FindCategoryByIdHandler,
} from '@application/services/category';
import {
    CreateCommentHandler,
    EditCommentHandler,
    DeleteCommentHandler,
    FindAllCommentsHandler,
    FindCommentByIdHandler,
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
    GetUserStatisticsHandler,
    GetEventStatisticsHandler,
    GetSystemStatisticsHandler,
} from '@application/services/statistics';
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
    StatisticsReader,
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
    statisticsReader: StatisticsReader;

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
    refreshTokensHandler: RefreshTokensHandler;
    logoutUserHandler: LogoutUserHandler;

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
    findCategoryByIdHandler: FindCategoryByIdHandler;

    // Comment Handlers
    createCommentHandler: CreateCommentHandler;
    editCommentHandler: EditCommentHandler;
    deleteCommentHandler: DeleteCommentHandler;
    findAllCommentsHandler: FindAllCommentsHandler;
    findCommentByIdHandler: FindCommentByIdHandler;
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

    // Statistics Handlers
    getUserStatisticsHandler: GetUserStatisticsHandler;
    getEventStatisticsHandler: GetEventStatisticsHandler;
    getSystemStatisticsHandler: GetSystemStatisticsHandler;

    // Controllers
    authController: AuthController;
    userController: UserController;
    eventController: EventController;
    categoryController: CategoryController;
    commentController: CommentController;
    notificationController: NotificationController;
    userTypeController: UserTypeController;
    geocoderController: GeocoderController;
    statisticsController: StatisticsController;
}

type ContainerType = AwilixContainer<Container>;

function registerInfrastructure(container: ContainerType): void {
    container.register({
        unitOfWork: asClass(PrismaUnitOfWork).singleton(),
    });
}

function registerReaders(container: ContainerType): void {
    container.register({
        userReader: asClass(UserReader).singleton(),
        eventReader: asClass(EventReader).singleton(),
        categoryReader: asClass(CategoryReader).singleton(),
        commentReader: asClass(CommentReader).singleton(),
        notificationReader: asClass(NotificationReader).singleton(),
        userTypeReader: asClass(UserTypeReader).singleton(),
        statisticsReader: asClass(StatisticsReader).singleton(),
    });
}

function registerRepositories(container: ContainerType): void {
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
}

function registerManagers(container: ContainerType): void {
    container.register({
        tokenManager: asClass(TokenManager).singleton(),
        emailManager: asClass(EmailManager).singleton(),
        fileStorageManager: asClass(FileStorageManager).singleton(),
        botManager: asClass(BotManager).singleton(),
        geocoderManager: asClass(GeocoderManager).singleton(),
    });
}

function registerAuthHandlers(container: ContainerType): void {
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
        refreshTokensHandler: asClass(RefreshTokensHandler)
            .inject((container) => ({
                tokenManager: container.resolve('tokenManager'),
            }))
            .singleton(),
        logoutUserHandler: asClass(LogoutUserHandler)
            .inject((container) => ({
                tokenManager: container.resolve('tokenManager'),
            }))
            .singleton(),
    });
}

function registerUserHandlers(container: ContainerType): void {
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
}

function registerEventHandlers(container: ContainerType): void {
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
                userReader: container.resolve('userReader'),
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
}

function registerCategoryHandlers(container: ContainerType): void {
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
        findCategoryByIdHandler: asClass(FindCategoryByIdHandler).singleton(),
    });
}

function registerCommentHandlers(container: ContainerType): void {
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
        findCommentByIdHandler: asClass(FindCommentByIdHandler).singleton(),
        findCommentsByEventHandler: asClass(FindCommentsByEventHandler).singleton(),
        findCommentsByUserHandler: asClass(FindCommentsByUserHandler).singleton(),
    });
}

function registerNotificationHandlers(container: ContainerType): void {
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
}

function registerUserTypeHandlers(container: ContainerType): void {
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
}

function registerGeocoderHandlers(container: ContainerType): void {
    container.register({
        findCoordinatesByLocationHandler: asClass(FindCoordinatesByLocationHandler)
            .inject((container) => ({
                geocoderManager: container.resolve('geocoderManager'),
            }))
            .singleton(),
    });
}

function registerStatisticsHandlers(container: ContainerType): void {
    container.register({
        getUserStatisticsHandler: asClass(GetUserStatisticsHandler).singleton(),
        getEventStatisticsHandler: asClass(GetEventStatisticsHandler).singleton(),
        getSystemStatisticsHandler: asClass(GetSystemStatisticsHandler).singleton(),
    });
}

function registerControllers(container: ContainerType): void {
    container.register({
        authController: asClass(AuthController)
            .inject((container) => ({
                createUserHandler: container.resolve('createUserHandler'),
                authenticateUserHandler: container.resolve('authenticateUserHandler'),
                confirmUserEmailHandler: container.resolve('confirmUserEmailHandler'),
                refreshTokensHandler: container.resolve('refreshTokensHandler'),
                logoutUserHandler: container.resolve('logoutUserHandler'),
            }))
            .singleton(),
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
        statisticsController: asClass(StatisticsController)
            .inject((container) => ({
                getUserStatisticsHandler: container.resolve('getUserStatisticsHandler'),
                getEventStatisticsHandler: container.resolve('getEventStatisticsHandler'),
                getSystemStatisticsHandler: container.resolve('getSystemStatisticsHandler'),
            }))
            .singleton(),
    });
}

export function createDIContainer() {
    const container = createContainer<Container>({
        injectionMode: InjectionMode.CLASSIC,
    });

    registerInfrastructure(container);
    registerReaders(container);
    registerRepositories(container);
    registerManagers(container);
    registerAuthHandlers(container);
    registerUserHandlers(container);
    registerEventHandlers(container);
    registerCategoryHandlers(container);
    registerCommentHandlers(container);
    registerNotificationHandlers(container);
    registerUserTypeHandlers(container);
    registerGeocoderHandlers(container);
    registerStatisticsHandlers(container);
    registerControllers(container);

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
    statisticsController: StatisticsController;
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
        statisticsController: container.resolve('statisticsController'),
    };
}
