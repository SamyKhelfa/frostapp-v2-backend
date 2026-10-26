import { config } from 'dotenv';
import { resolve } from 'path';
import { PrismaClient } from '@prisma/client';

config({ path: resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

const V = (id: string) => `https://vimeo.com/${id}`;

type Module = { title: string; description: string; video: string; duration: number };
type Chapitre = { title: string; description: string; image: string; subChapters: Module[] };
type Cours = { title: string; description: string; chapters: Chapitre[] };

const COURS: Cours[] = [
  {
    title: 'Maitriser le froid : les fondamentaux',
    description:
      'Ce qui se passe dans ton corps, et comment aborder tes premieres semaines sans te brusquer.',
    chapters: [
      {
        title: 'Comprendre la reponse au froid',
        description: 'Pourquoi le corps reagit comme il reagit, et ce que tu peux en attendre.',
        image: 'https://i.vimeocdn.com/video/687867313-3354aaaac23bd9fa40bdab9cfb6ba478b802acd47ef2522f9473ff7b1ce62790-d_640?region=us',
        subChapters: [
          {
            title: 'Le choc initial',
            description:
              'Les trente premieres secondes sont les plus dures. On regarde pourquoi, et ce qui change ensuite.',
            video: V('259411563'),
            duration: 3,
          },
          {
            title: 'Ce que le froid demande au mental',
            description:
              'L inconfort n est pas un signal de danger. Apprendre a distinguer les deux.',
            video: V('1152368501'),
            duration: 2,
          },
        ],
      },
      {
        title: 'Ta premiere semaine',
        description: 'Un protocole progressif, jour par jour.',
        image: 'https://i.vimeocdn.com/video/999273202-ec29fa755f961a154cf062e2e5f44c6f1c5bb08bbb974bc731269c6d29673232-d_640?region=us',
        subChapters: [
          {
            title: 'Jours 1 a 3 : finir sa douche en froid',
            description:
              'Trente secondes a la fin d une douche normale. Rien de plus pour commencer.',
            video: V('481905328'),
            duration: 11,
          },
          {
            title: 'Jours 4 a 7 : allonger sans forcer',
            description: 'Comment augmenter la duree sans casser la regularite.',
            video: V('638846086'),
            duration: 12,
          },
        ],
      },
    ],
  },
  {
    title: 'Respiration et immersion',
    description:
      'La respiration avant l eau, puis le passage au bain froid. Jamais seul, jamais apres un repas.',
    chapters: [
      {
        title: 'La respiration',
        description: 'Trois cycles avant d entrer. Pourquoi, et comment les mener.',
        image: 'https://i.vimeocdn.com/video/827409941-982c63450ed48f49cbf19263291bfac26da5d38a207f407ce3109286e3844c41-d_640?region=us',
        subChapters: [
          {
            title: 'Les cycles de base',
            description: 'Inspiration profonde, retention, relache. Le rythme et les reperes.',
            video: V('370200524'),
            duration: 12,
          },
          {
            title: 'Les erreurs a eviter',
            description:
              'Hyperventiler avant une immersion est dangereux. On voit pourquoi et ce qu il faut faire a la place.',
            video: V('935281489'),
            duration: 16,
          },
        ],
      },
      {
        title: 'Le bain de glace',
        description: 'Preparation, duree, sortie et rechauffement.',
        image: 'https://i.vimeocdn.com/video/1548910025-851813b406228fb2af1fb7687cfca93668358995d821e2c1be00c4a1df9baed2-d_640?region=us',
        subChapters: [
          {
            title: 'Preparer son bain',
            description: 'Temperature, quantite de glace, materiel minimal.',
            video: V('771635802'),
            duration: 33,
          },
          {
            title: 'Entrer, tenir, sortir',
            description:
              'Deux a trois minutes suffisent. Le rechauffement compte autant que l immersion.',
            video: V('666109154'),
            duration: 40,
          },
        ],
      },
    ],
  },
  {
    title: 'Tenir dans la duree',
    description:
      'La regularite bat l intensite. Construire une habitude qui survit aux mauvaises semaines.',
    chapters: [
      {
        title: 'Construire l habitude',
        description: 'Accrocher la pratique a quelque chose qui existe deja dans ta journee.',
        image: 'https://i.vimeocdn.com/video/1740926714-3b21615a47ec8ec9c53fc437ccc5313b932ef8c8467319cd8e637730b14cd34e-d_640?region=us',
        subChapters: [
          {
            title: 'La serie, et pourquoi elle marche',
            description:
              'Ne pas casser la chaine est un moteur plus fort que la motivation du jour.',
            video: V('876085090'),
            duration: 29,
          },
          {
            title: 'Rater un jour sans tout arreter',
            description: 'Une journee manquee n efface pas le travail. Comment repartir.',
            video: V('832044405'),
            duration: 33,
          },
        ],
      },
      {
        title: 'Aller plus loin',
        description: 'Quand et comment augmenter la difficulte.',
        image: 'https://i.vimeocdn.com/video/2106266877-f53aa2cb7fb018a050b002bf05e6b090ab97e0b169a223241d7685c59563495f-d_640?region=us',
        subChapters: [
          {
            title: 'Eau libre et lacs de montagne',
            description:
              'Sortir de la salle de bain demande des precautions supplementaires.',
            video: V('1154070144'),
            duration: 7,
          },
        ],
      },
    ],
  },
  {
    title: 'Eau libre : lacs, rivieres et mer',
    description:
      'Sortir de la salle de bain. Reperer un spot, evaluer les risques, ne jamais y aller seul.',
    chapters: [
      {
        title: 'Choisir et lire son spot',
        description: 'Courant, profondeur, sortie de l eau. Ce qu il faut verifier avant d entrer.',
        image: 'https://i.vimeocdn.com/video/432953110-a4ccb68e16f92d708374ff31edadb7fcc817ca5b641723216d886312ab2d38a8-d_640?region=us',
        subChapters: [
          {
            title: 'Lire le plan d eau',
            description:
              'Un lac de montagne, une riviere et la mer n ont ni les memes courants ni les memes sorties.',
            video: V('62831314'),
            duration: 5,
          },
          {
            title: 'Le binome, non negociable',
            description:
              'On n entre jamais seul en eau libre. Le role de celui qui reste au bord.',
            video: V('69040350'),
            duration: 5,
          },
          {
            title: 'Materiel minimal',
            description:
              'Bonnet, chaussons, bouee de signalisation, et de quoi se rechabiller vite.',
            video: V('61567729'),
            duration: 6,
          },
        ],
      },
      {
        title: 'La sortie de l eau',
        description: 'Le moment le plus sous-estime, et le plus risque.',
        image: 'https://i.vimeocdn.com/video/670609568-4855f744e8c939fdf2ef5ba248c40c197b2946815b3b55f63c66e262515a49ab-d_640?region=us',
        subChapters: [
          {
            title: 'L afterdrop',
            description:
              'La temperature continue de baisser apres la sortie. Pourquoi, et comment s y preparer.',
            video: V('245804159'),
            duration: 3,
          },
          {
            title: 'Se rechauffer sans brusquer',
            description:
              'Pas de douche chaude immediate. Couches seches, boisson chaude, mouvement doux.',
            video: V('70656175'),
            duration: 2,
          },
        ],
      },
    ],
  },
  {
    title: 'Froid et recuperation sportive',
    description:
      'Ce que le froid fait vraiment apres l effort, ce qu il ne fait pas, et quand il vaut mieux s abstenir.',
    chapters: [
      {
        title: 'Ce que dit la pratique',
        description: 'Separer les effets observes des promesses marketing.',
        image: 'https://i.vimeocdn.com/video/793830756-7f143f1455a583bf498d96221c463a096aea03767cc0d73418874ca5488e9022-d_640?region=us',
        subChapters: [
          {
            title: 'Douleurs musculaires et inflammation',
            description:
              'Le froid reduit la sensation de douleur. Sur la reparation du muscle, c est plus nuance.',
            video: V('344361560'),
            duration: 11,
          },
          {
            title: 'Le piege de l immersion apres musculation',
            description:
              'Refroidir juste apres une seance de force peut limiter les adaptations recherchees.',
            video: V('70056761'),
            duration: 9,
          },
        ],
      },
      {
        title: 'Placer le froid dans sa semaine',
        description: 'Quand il aide, quand il gene, quand il ne sert a rien.',
        image: 'https://i.vimeocdn.com/video/1951492719-3f83a5ee736cc35dbdeb922bdf9f73d5d623797180dfe575be5ae5ed78b1c94e-d_640?region=us',
        subChapters: [
          {
            title: 'Construire sa semaine type',
            description:
              'Loin des seances de force, proche des journees de competition ou de charge elevee.',
            video: V('1030868189'),
            duration: 25,
          },
        ],
      },
    ],
  },
];

async function main() {
  for (const cours of COURS) {
    const existant = await prisma.lesson.findFirst({ where: { title: cours.title } });

    if (existant) {
      console.log(`${cours.title} : existe deja (id ${existant.id}), ignore`);
      continue;
    }

    const lesson = await prisma.lesson.create({
      data: { title: cours.title, description: cours.description },
    });

    let positionChapitre = 1;
    let nbModules = 0;

    for (const chapitre of cours.chapters) {
      const created = await prisma.chapter.create({
        data: {
          title: chapitre.title,
          description: chapitre.description,
          image: chapitre.image,
          status: true,
          position: positionChapitre,
          lessonId: lesson.id,
        },
      });

      let positionModule = 1;

      for (const module of chapitre.subChapters) {
        await prisma.subChapter.create({
          data: {
            title: module.title,
            description: module.description,
            video: module.video,
            duration: module.duration,
            active: true,
            status: true,
            position: positionModule,
            chapterId: created.id,
          },
        });
        positionModule += 1;
        nbModules += 1;
      }

      positionChapitre += 1;
    }

    console.log(
      `${cours.title} : ${cours.chapters.length} chapitres, ${nbModules} modules`,
    );
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
