import 'dotenv/config';
import { hash } from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role } from '../generated/prisma/client';
import { BCRYPT_ROUNDS } from '../src/common/constants/encrypt';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Seeding database...');

    const userTypes = [
        { typeName: 'Пользователь', role: Role.USER },
        { typeName: 'Организатор', role: Role.ORGANIZER },
        { typeName: 'Администратор', role: Role.ADMIN },
    ];

    for (const userType of userTypes) {
        await prisma.userType.upsert({
            where: { typeName: userType.typeName },
            update: {},
            create: userType,
        });
        console.log(`Seeded ${userType.typeName}`);
    }

    const adminUserType = await prisma.userType.findFirst({
        where: { role: Role.ADMIN },
    });

    if (!adminUserType) {
        throw new Error('Admin user type not found');
    }

    const adminPassword = 'AdminPass123!';
    const adminPasswordHash = await hash(adminPassword, BCRYPT_ROUNDS);

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

    console.log('Seeded admin user');
    console.log('   Email: admin@gmail.com');
    console.log('   Password: AdminPass123!');
    console.log('Seeding completed!');
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
