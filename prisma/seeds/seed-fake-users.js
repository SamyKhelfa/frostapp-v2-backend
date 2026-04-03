"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const path_1 = require("path");
const bcrypt = require("bcrypt");
const client_1 = require("@prisma/client");
(0, dotenv_1.config)({ path: (0, path_1.resolve)(__dirname, '../.env') });
const prisma = new client_1.PrismaClient();
const PLAIN_PASSWORD = 'FakeUser123!';
const NAMES = [
    'Léa Martin',
    'Thomas Dubois',
    'Camille Bernard',
    'Hugo Petit',
    'Emma Roux',
    'Lucas Moreau',
    'Chloé Simon',
    'Nathan Laurent',
    'Manon Michel',
    'Louis Garcia',
    'Inès David',
    'Ethan Bertrand',
    'Julie Roussel',
    'Noah Girard',
    'Sarah Bonnet',
    'Gabriel Dupont',
    'Océane Fontaine',
    'Mathis Chevalier',
    'Clara Mercier',
    'Raphaël Colin',
];
async function main() {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(PLAIN_PASSWORD, salt);
    const rows = NAMES.map((name, i) => {
        const n = i + 1;
        const role = n === 3 || n === 7 ? client_1.UserRolesEnum.admin : client_1.UserRolesEnum.user;
        const active = n % 5 !== 0;
        return {
            email: `seed.user.${n}@example.test`,
            name,
            password: passwordHash,
            role,
            active,
        };
    });
    const result = await prisma.user.createMany({
        data: rows,
        skipDuplicates: true,
    });
    console.log(`Inserted ${result.count} user(s) (skipped duplicates if emails already exist).`);
    console.log(`Default password for all: ${PLAIN_PASSWORD}`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-fake-users.js.map