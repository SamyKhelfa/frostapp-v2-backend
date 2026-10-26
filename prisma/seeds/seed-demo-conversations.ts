import { config } from 'dotenv';
import { resolve } from 'path';
import {
  PrismaClient,
  ConversationType,
  JoinPolicy,
  ParticipantRole,
  ParticipantStatus,
  NotificationType,
} from '@prisma/client';

config({ path: resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

const SAMY_A = 25;
const SAMY_B = 26;

const MAXIME = 16;
const LEA = 17;
const ANNA = 19;
const SOFIA = 20;
const JULIE = 21;
const CAPUCINE = 22;
const RENOIR = 24;
const CAMILLE = 27;
const VINCENT = 29;
const CHRIS = 30;
const FETTOUMA = 31;

const HOUR = 60 * 60 * 1000;

function ago(hours: number): Date {
  return new Date(Date.now() - hours * HOUR);
}

type Seed = {
  name: string;
  description: string;
  joinPolicy: JoinPolicy;
  createdById: number;
  participants: { userId: number; role?: ParticipantRole; status?: ParticipantStatus }[];
  messages: { authorId: number; content: string; hoursAgo: number }[];
};

const COMMUNITIES: Seed[] = [
  {
    name: 'Premiers pas dans le froid',
    description: 'Pour celles et ceux qui commencent. Aucune question n est bete.',
    joinPolicy: JoinPolicy.OPEN,
    createdById: MAXIME,
    participants: [
      { userId: MAXIME, role: ParticipantRole.OWNER },
      { userId: SAMY_A },
      { userId: SAMY_B },
      { userId: ANNA },
      { userId: SOFIA },
      { userId: CAPUCINE },
    ],
    messages: [
      { authorId: ANNA, content: 'Premiere douche froide ce matin, 20 secondes et j ai craque', hoursAgo: 52 },
      { authorId: MAXIME, content: 'C est deja tres bien. Personne ne tient 2 minutes au debut', hoursAgo: 51 },
      { authorId: ANNA, content: 'Je dois descendre progressivement la temperature ou direct froid ?', hoursAgo: 50 },
      { authorId: MAXIME, content: 'Finis ta douche normale, puis passe en froid sur les 30 dernieres secondes. Tu augmentes chaque semaine', hoursAgo: 49 },
      { authorId: SOFIA, content: 'C est comme ca que j ai fait. En 3 semaines je suis passee a 2 minutes', hoursAgo: 48 },
      { authorId: CAPUCINE, content: 'Le plus dur c est la nuque pour moi', hoursAgo: 26 },
      { authorId: MAXIME, content: 'Normal, il y a beaucoup de recepteurs la. Commence par les jambes et remonte', hoursAgo: 25 },
      { authorId: ANNA, content: '45 secondes ce matin, ca progresse', hoursAgo: 6 },
      { authorId: SOFIA, content: 'Bravo', hoursAgo: 5 },
      { authorId: CAPUCINE, content: 'Quelqu un fait ca le soir plutot que le matin ?', hoursAgo: 2 },
    ],
  },
  {
    name: 'Defi 30 jours',
    description: 'Une douche froide par jour pendant 30 jours. On se tient au courant ici.',
    joinPolicy: JoinPolicy.OPEN,
    createdById: CAMILLE,
    participants: [
      { userId: CAMILLE, role: ParticipantRole.OWNER },
      { userId: SAMY_A },
      { userId: SAMY_B },
      { userId: JULIE },
      { userId: RENOIR },
      { userId: VINCENT },
      { userId: CHRIS },
    ],
    messages: [
      { authorId: CAMILLE, content: 'Jour 12 pour moi. La serie tient', hoursAgo: 30 },
      { authorId: JULIE, content: 'Jour 9. J ai failli sauter hier soir, c est l appli qui m a rattrapee', hoursAgo: 29 },
      { authorId: RENOIR, content: 'Jour 4, je rame mais je suis la', hoursAgo: 28 },
      { authorId: VINCENT, content: 'Question bete : si je valide a 1h du matin ca compte pour quel jour ?', hoursAgo: 9 },
      { authorId: CAMILLE, content: 'Pour la veille. Il y a une tolerance jusqu a 6h', hoursAgo: 8 },
      { authorId: VINCENT, content: 'Parfait, ma serie est sauvee', hoursAgo: 8 },
      { authorId: CHRIS, content: 'Jour 21. Le plus dur etait la premiere semaine', hoursAgo: 3 },
      { authorId: JULIE, content: 'Ca motive de voir ca', hoursAgo: 1 },
    ],
  },
  {
    name: 'Cercle avance',
    description: 'Bains de glace et respiration. Admission sur validation.',
    joinPolicy: JoinPolicy.APPROVAL,
    createdById: SAMY_A,
    participants: [
      { userId: SAMY_A, role: ParticipantRole.OWNER },
      { userId: SAMY_B, role: ParticipantRole.ADMIN },
      { userId: SOFIA },
      { userId: FETTOUMA, status: ParticipantStatus.PENDING },
      { userId: VINCENT, status: ParticipantStatus.PENDING },
    ],
    messages: [
      { authorId: SOFIA, content: 'Seance de 4 minutes a 3 degres ce matin', hoursAgo: 20 },
      { authorId: SAMY_A, content: 'Tu fais la respiration avant ou apres ?', hoursAgo: 19 },
      { authorId: SOFIA, content: 'Avant. Trois cycles, puis j entre', hoursAgo: 19 },
      { authorId: SAMY_A, content: 'Deux demandes d admission en attente, je regarde ca', hoursAgo: 4 },
    ],
  },
  {
    name: 'Bains de glace Chamonix',
    description: 'Sorties en lac de montagne. Groupe local, admission sur validation.',
    joinPolicy: JoinPolicy.APPROVAL,
    createdById: CHRIS,
    participants: [
      { userId: CHRIS, role: ParticipantRole.OWNER },
      { userId: RENOIR },
      { userId: LEA },
    ],
    messages: [
      { authorId: CHRIS, content: 'Sortie au lac Blanc samedi matin, 6 degres annonces', hoursAgo: 15 },
      { authorId: RENOIR, content: 'Je suis partant', hoursAgo: 14 },
      { authorId: LEA, content: 'Combien de temps dans l eau en general ?', hoursAgo: 13 },
      { authorId: CHRIS, content: 'Deux a trois minutes, jamais seul et jamais apres un repas', hoursAgo: 12 },
    ],
  },
];

async function main() {
  for (const seed of COMMUNITIES) {
    const existing = await prisma.conversation.findFirst({
      where: { name: seed.name, type: ConversationType.COMMUNITY },
    });

    if (existing) {
      console.log(`${seed.name} : existe deja (id ${existing.id}), ignore`);
      continue;
    }

    const conversation = await prisma.conversation.create({
      data: {
        type: ConversationType.COMMUNITY,
        name: seed.name,
        description: seed.description,
        joinPolicy: seed.joinPolicy,
        createdById: seed.createdById,
      },
    });

    for (const p of seed.participants) {
      await prisma.conversationParticipant.create({
        data: {
          conversationId: conversation.id,
          userId: p.userId,
          role: p.role ?? ParticipantRole.MEMBER,
          status: p.status ?? ParticipantStatus.ACTIVE,
        },
      });
    }

    for (const m of seed.messages) {
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          authorId: m.authorId,
          content: m.content,
          createdAt: ago(m.hoursAgo),
        },
      });
    }

    const pending = seed.participants.filter(
      (p) => p.status === ParticipantStatus.PENDING,
    );
    const admins = seed.participants.filter(
      (p) =>
        p.role === ParticipantRole.OWNER || p.role === ParticipantRole.ADMIN,
    );

    for (const request of pending) {
      for (const admin of admins) {
        await prisma.notification.create({
          data: {
            userId: admin.userId,
            type: NotificationType.JOIN_REQUEST,
            actorId: request.userId,
            conversationId: conversation.id,
            createdAt: ago(4),
          },
        });
      }
    }

    console.log(
      `${seed.name} : ${seed.participants.length} participants, ${seed.messages.length} messages, ${pending.length} demande(s)`,
    );
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
