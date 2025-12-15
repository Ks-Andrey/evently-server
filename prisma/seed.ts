import 'dotenv/config';
import { hash } from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role, NotificationType } from '../generated/prisma/client';
import { BCRYPT_ROUNDS } from '../src/common/constants/encrypt';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const DEFAULT_PASSWORD = 'TestPass123!';

async function main() {
    console.log('Seeding database...');
    console.log('\n1. Seeding user types...');
    const userTypes = [
        { typeName: 'Пользователь', role: Role.USER },
        { typeName: 'Организатор', role: Role.ORGANIZER },
        { typeName: 'Администратор', role: Role.ADMIN },
    ];

    const createdUserTypes: Record<string, string> = {};
    for (const userType of userTypes) {
        const created = await prisma.userType.upsert({
            where: { typeName: userType.typeName },
            update: {},
            create: userType,
        });
        createdUserTypes[userType.typeName] = created.userTypeId;
        console.log(`Seeded ${userType.typeName}`);
    }

    console.log('\n2. Seeding categories...');
    const categories = [
        { categoryName: 'Музыка' },
        { categoryName: 'Спорт' },
        { categoryName: 'Искусство' },
        { categoryName: 'Еда' },
        { categoryName: 'Технологии' },
        { categoryName: 'Кино' },
        { categoryName: 'Образование' },
    ];

    const createdCategories: Record<string, string> = {};
    for (const category of categories) {
        const created = await prisma.category.upsert({
            where: { categoryName: category.categoryName },
            update: {},
            create: category,
        });
        createdCategories[category.categoryName] = created.categoryId;
        console.log(`Seeded ${category.categoryName}`);
    }

    console.log('\n3. Seeding users...');
    const passwordHash = await hash(DEFAULT_PASSWORD, BCRYPT_ROUNDS);

    const user1 = await prisma.user.upsert({
        where: { email: 'alex@example.com' },
        update: {},
        create: {
            userTypeId: createdUserTypes['Пользователь'],
            username: 'Александр',
            email: 'alex@example.com',
            passwordHash,
            emailVerified: true,
            subscriptionCount: 12,
            isBlocked: false,
            personalData: 'Люблю события и активный отдых',
            imageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
        },
    });
    console.log(`Seeded user: ${user1.username}`);

    const organizer1 = await prisma.user.upsert({
        where: { email: 'neon@example.com' },
        update: {},
        create: {
            userTypeId: createdUserTypes['Организатор'],
            username: 'NEON Events',
            email: 'neon@example.com',
            passwordHash,
            emailVerified: true,
            subscriptionCount: 0,
            isBlocked: false,
            personalData: 'Организуем лучшие электронные фестивали',
            imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&q=80',
        },
    });
    console.log(`Seeded organizer: ${organizer1.username}`);

    const organizer2 = await prisma.user.upsert({
        where: { email: 'moscowrun@example.com' },
        update: {},
        create: {
            userTypeId: createdUserTypes['Организатор'],
            username: 'Moscow Run Club',
            email: 'moscowrun@example.com',
            passwordHash,
            emailVerified: true,
            subscriptionCount: 0,
            isBlocked: false,
        },
    });
    console.log(`Seeded organizer: ${organizer2.username}`);

    const organizer3 = await prisma.user.upsert({
        where: { email: 'artspace@example.com' },
        update: {},
        create: {
            userTypeId: createdUserTypes['Организатор'],
            username: 'ArtSpace Gallery',
            email: 'artspace@example.com',
            passwordHash,
            emailVerified: true,
            subscriptionCount: 0,
            isBlocked: false,
        },
    });
    console.log(`Seeded organizer: ${organizer3.username}`);

    const organizer4 = await prisma.user.upsert({
        where: { email: 'foodfest@example.com' },
        update: {},
        create: {
            userTypeId: createdUserTypes['Организатор'],
            username: 'FoodFest Moscow',
            email: 'foodfest@example.com',
            passwordHash,
            emailVerified: true,
            subscriptionCount: 0,
            isBlocked: false,
        },
    });
    console.log(`Seeded organizer: ${organizer4.username}`);

    const organizer5 = await prisma.user.upsert({
        where: { email: 'techhub@example.com' },
        update: {},
        create: {
            userTypeId: createdUserTypes['Организатор'],
            username: 'TechHub Russia',
            email: 'techhub@example.com',
            passwordHash,
            emailVerified: true,
            subscriptionCount: 0,
            isBlocked: false,
        },
    });
    console.log(`Seeded organizer: ${organizer5.username}`);

    const user2 = await prisma.user.upsert({
        where: { email: 'maria@example.com' },
        update: {},
        create: {
            userTypeId: createdUserTypes['Пользователь'],
            username: 'Мария К.',
            email: 'maria@example.com',
            passwordHash,
            emailVerified: true,
            subscriptionCount: 0,
            isBlocked: false,
            imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
        },
    });
    console.log(`Seeded user: ${user2.username}`);

    const user3 = await prisma.user.upsert({
        where: { email: 'dmitry@example.com' },
        update: {},
        create: {
            userTypeId: createdUserTypes['Пользователь'],
            username: 'Дмитрий В.',
            email: 'dmitry@example.com',
            passwordHash,
            emailVerified: true,
            subscriptionCount: 0,
            isBlocked: false,
            imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
        },
    });
    console.log(`Seeded user: ${user3.username}`);

    const user4 = await prisma.user.upsert({
        where: { email: 'anna@example.com' },
        update: {},
        create: {
            userTypeId: createdUserTypes['Пользователь'],
            username: 'Анна С.',
            email: 'anna@example.com',
            passwordHash,
            emailVerified: true,
            subscriptionCount: 0,
            isBlocked: false,
        },
    });
    console.log(`Seeded user: ${user4.username}`);

    const user5 = await prisma.user.upsert({
        where: { email: 'ivan@example.com' },
        update: {},
        create: {
            userTypeId: createdUserTypes['Пользователь'],
            username: 'Иван П.',
            email: 'ivan@example.com',
            passwordHash,
            emailVerified: true,
            subscriptionCount: 0,
            isBlocked: false,
        },
    });
    console.log(`Seeded user: ${user5.username}`);

    const adminUserType = await prisma.userType.findFirst({
        where: { role: Role.ADMIN },
    });

    if (!adminUserType) {
        throw new Error('Admin user type not found');
    }

    const adminPasswordHash = await hash('AdminPass123!', BCRYPT_ROUNDS);
    await prisma.user.upsert({
        where: { email: 'admin@gmail.com' },
        update: {},
        create: {
            userTypeId: adminUserType.userTypeId,
            username: 'admin',
            email: 'admin@gmail.com',
            passwordHash: adminPasswordHash,
            emailVerified: true,
            subscriptionCount: 0,
            isBlocked: false,
        },
    });
    console.log(`Seeded admin user`);

    console.log('\n4. Seeding events...');
    const now = Date.now();

    const event1 = await prisma.event.create({
        data: {
            organizerId: organizer1.id,
            categoryId: createdCategories['Музыка'],
            title: 'Электронный фестиваль NEON NIGHTS',
            description:
                'Погрузитесь в мир электронной музыки с лучшими диджеями страны! Три сцены, световое шоу и незабываемая атмосфера. Фестиваль объединит тысячи любителей электронной музыки в одном месте.',
            date: new Date('2025-12-20T20:00:00'),
            location: 'Arena Moscow, ул. Ленина, 42',
            latitude: 55.7558,
            longitude: 37.6173,
            subscriberCount: 2847,
            commentCount: 0,
        },
    });
    console.log(`Seeded event: ${event1.title}`);

    const event2 = await prisma.event.create({
        data: {
            organizerId: organizer2.id,
            categoryId: createdCategories['Спорт'],
            title: 'Марафон Москва 2025',
            description:
                'Ежегодный городской марафон! Дистанции на любой уровень подготовки: 5 км, 10 км, 21 км и полный марафон 42 км.',
            date: new Date('2025-12-21T08:00:00'),
            location: 'Парк Горького, Крымский Вал, 9',
            latitude: 55.7312,
            longitude: 37.6019,
            subscriberCount: 5621,
            commentCount: 0,
        },
    });
    console.log(`Seeded event: ${event2.title}`);

    const event3 = await prisma.event.create({
        data: {
            organizerId: organizer3.id,
            categoryId: createdCategories['Искусство'],
            title: 'Выставка современного искусства "ГРАНИ"',
            description:
                'Более 200 работ от 50 современных художников. Инсталляции, живопись, скульптура и digital-арт. Откройте для себя новые грани современного искусства.',
            date: new Date('2025-12-22T10:00:00'),
            location: 'ЦСИ Винзавод, 4-й Сыромятнический пер., 1',
            latitude: 55.7539,
            longitude: 37.6671,
            subscriberCount: 1893,
            commentCount: 0,
        },
    });
    console.log(`Seeded event: ${event3.title}`);

    const event4 = await prisma.event.create({
        data: {
            organizerId: organizer4.id,
            categoryId: createdCategories['Еда'],
            title: 'Гастрономический фестиваль "ВКУСЫ МИРА"',
            description:
                'Кулинарное путешествие по кухням 30 стран мира! Дегустации, мастер-классы от шеф-поваров, фуд-корты и винный бар. Откройте новые вкусы!',
            date: new Date('2025-12-25T12:00:00'),
            location: 'Музеон, Крымский Вал, 10',
            latitude: 55.7352,
            longitude: 37.6051,
            subscriberCount: 4210,
            commentCount: 0,
        },
    });
    console.log(`Seeded event: ${event4.title}`);

    const event5 = await prisma.event.create({
        data: {
            organizerId: organizer5.id,
            categoryId: createdCategories['Технологии'],
            title: 'Tech Conference 2025',
            description:
                'Крупнейшая IT-конференция года! Доклады от лидеров индустрии, воркшопы, нетворкинг и хакатон. Узнайте о последних трендах в AI, blockchain и web3.',
            date: new Date('2026-01-05T09:00:00'),
            location: 'Технопарк Сколково, Большой бульвар, 42',
            latitude: 55.6867,
            longitude: 37.3587,
            subscriberCount: 7832,
            commentCount: 0,
        },
    });
    console.log(`Seeded event: ${event5.title}`);

    console.log('\n5. Seeding comments...');
    const comments = [
        {
            eventId: event1.id,
            authorId: user1.id,
            text: 'Был в прошлом году, это было невероятно! 🔥',
            createdAt: new Date(now - 2 * 60 * 60 * 1000),
        },
        {
            eventId: event1.id,
            authorId: organizer1.id,
            text: 'Спасибо за отзыв! В этом году будет еще круче! Ждем всех на фестивале! 🎉',
            createdAt: new Date(now - 1 * 60 * 60 * 1000),
        },
        {
            eventId: event1.id,
            authorId: user2.id,
            text: 'Кто-нибудь идёт компанией? Ищу попутчиков!',
            createdAt: new Date(now - 5 * 60 * 60 * 1000),
        },
        {
            eventId: event1.id,
            authorId: user1.id,
            text: 'Подскажите, будет ли парковка? И сколько стоит билет?',
            createdAt: new Date(now - 3 * 60 * 60 * 1000),
        },
        {
            eventId: event1.id,
            authorId: organizer1.id,
            text: 'Парковка будет бесплатной! Билеты можно приобрести на сайте или на входе. Подробности в описании события.',
            createdAt: new Date(now - 2 * 60 * 60 * 1000),
        },
        {
            eventId: event1.id,
            authorId: user3.id,
            text: 'Организация на высшем уровне, рекомендую!',
            createdAt: new Date(now - 24 * 60 * 60 * 1000),
        },
    ];

    for (const comment of comments) {
        await prisma.comment.create({
            data: comment,
        });
    }

    await prisma.event.update({
        where: { id: event1.id },
        data: { commentCount: comments.length },
    });

    console.log(`Seeded ${comments.length} comments`);

    console.log('\n6. Seeding event subscriptions...');
    const subscriptions = [
        { eventId: event1.id, userId: user1.id },
        { eventId: event1.id, userId: user2.id },
        { eventId: event1.id, userId: user3.id },
        { eventId: event2.id, userId: user1.id },
        { eventId: event2.id, userId: user2.id },
        { eventId: event4.id, userId: user1.id },
        { eventId: event4.id, userId: user2.id },
        { eventId: event4.id, userId: user3.id },
        { eventId: event4.id, userId: user4.id },
    ];

    for (const subscription of subscriptions) {
        await prisma.eventSubscription.upsert({
            where: {
                eventId_userId: {
                    eventId: subscription.eventId,
                    userId: subscription.userId,
                },
            },
            update: {},
            create: subscription,
        });
    }

    console.log(`Seeded ${subscriptions.length} subscriptions`);

    console.log('\n7. Seeding notifications...');
    const notification = await prisma.notification.create({
        data: {
            eventId: event1.id,
            userId: organizer1.id,
            type: NotificationType.EVENT_UPDATED,
            message: 'Новое событие от NEON Events: Электронный фестиваль NEON NIGHTS',
            createdAt: new Date(now - 1 * 60 * 60 * 1000),
        },
    });
    console.log(`Seeded notification`);

    console.log('\nSeeding completed!');
    console.log(`\nTest credentials:`);
    console.log(`   User: alex@example.com / ${DEFAULT_PASSWORD}`);
    console.log(`   Organizer: neon@example.com / ${DEFAULT_PASSWORD}`);
    console.log(`   Admin: admin@gmail.com / AdminPass123!`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
