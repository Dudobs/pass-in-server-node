// node-notes, ln 34
import { prisma } from '../src/lib/prisma';

async function seed() {
  await prisma.event.create({
    data: {
      id: '7781308e-faad-4652-a1f2-37c9d65051be',
      title: 'Nlw Unite',
      slug: 'nlw-unite',
      details: 'Evento Next Level Week, edição Unite.',
      maximumAttendees: 120,
    }
  })
}

seed().then(() => {
  console.log('Database seeded!')
  prisma.$disconnect()
})