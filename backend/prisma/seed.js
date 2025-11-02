// backend/prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Usamos upsert por id (campo único) para garantir que o registro exista
  const parish = await prisma.parish.upsert({
    where: { id: 1 },              // <-- aqui usamos id (único)
    update: {},
    create: {
      name: 'Paróquia Cristo Libertador',
      city: 'Ipatinga',
      state: 'MG',
      communities: {
        create: [
          { name: 'Santuário São Judas Tadeu' },
          { name: 'Comunidade Nossa Senhora Aparecida' },
          { name: 'Comunidade São Francisco de Assis' }
        ]
      }
    }
  });

  // Encontra a comunidade principal (por name, já que agora existe)
  const community = await prisma.community.findFirst({
    where: { name: 'Santuário São Judas Tadeu' }
  });

  // Adiciona dizimistas de exemplo (skipDuplicates evita erro se já existir)
  if (community) {
    await prisma.dizimista.createMany({
      data: [
        {
          name: 'José da Silva',
          cpf: '00000000000',
          email: 'jose@example.com',
          communityId: community.id
        },
        {
          name: 'Maria Souza',
          cpf: '11111111111',
          email: 'maria@example.com',
          communityId: community.id
        }
      ],
      skipDuplicates: true
    });
  }

  console.log('✅ Seed concluída com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro ao executar o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
