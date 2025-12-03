import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role } from '../generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Seeding database...');

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
        console.log(`✅ Seeded ${userType.typeName}`);
    }

    console.log('✨ Seeding completed!');
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
