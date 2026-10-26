import { PrismaService } from 'src/prisma/prisma.service';
import {
  ColdShowerService,
  currentStreakFrom,
  longestStreakFrom,
  shiftDay,
} from './cold-shower.service';

const TODAY = '2026-08-22';

describe('shiftDay', () => {
  it('recule d un jour', () => {
    expect(shiftDay('2026-08-22', -1)).toBe('2026-08-21');
  });

  it('passe le changement de mois', () => {
    expect(shiftDay('2026-09-01', -1)).toBe('2026-08-31');
  });

  it('passe une annee bissextile', () => {
    expect(shiftDay('2028-03-01', -1)).toBe('2028-02-29');
  });
});

describe('currentStreakFrom', () => {
  it('vaut zero sans aucune entree', () => {
    expect(currentStreakFrom([], TODAY)).toBe(0);
  });

  it('compte une serie qui se termine aujourd hui', () => {
    const keys = ['2026-08-22', '2026-08-21', '2026-08-20'];
    expect(currentStreakFrom(keys, TODAY)).toBe(3);
  });

  it('reste vivante si la derniere douche date d hier', () => {
    const keys = ['2026-08-21', '2026-08-20'];
    expect(currentStreakFrom(keys, TODAY)).toBe(2);
  });

  it('tombe a zero si la derniere douche date d avant-hier', () => {
    const keys = ['2026-08-20', '2026-08-19'];
    expect(currentStreakFrom(keys, TODAY)).toBe(0);
  });

  it('s arrete au premier jour manquant', () => {
    const keys = ['2026-08-22', '2026-08-21', '2026-08-19', '2026-08-18'];
    expect(currentStreakFrom(keys, TODAY)).toBe(2);
  });

  it('traverse un changement de mois', () => {
    const keys = ['2026-09-01', '2026-08-31', '2026-08-30'];
    expect(currentStreakFrom(keys, '2026-09-01')).toBe(3);
  });
});

describe('longestStreakFrom', () => {
  it('vaut zero sans aucune entree', () => {
    expect(longestStreakFrom([])).toBe(0);
  });

  it('retient la plus longue serie, meme ancienne', () => {
    const keys = [
      '2026-08-22',
      '2026-08-10',
      '2026-08-09',
      '2026-08-08',
      '2026-08-07',
    ];
    expect(longestStreakFrom(keys)).toBe(4);
  });

  it('vaut un quand aucune journee ne se suit', () => {
    expect(longestStreakFrom(['2026-08-22', '2026-08-20'])).toBe(1);
  });
});

describe('effectiveTodayKey', () => {
  // La methode ne touche pas la base : un service sans Prisma suffit a la tester.
  const service = new ColdShowerService(null as unknown as PrismaService);
  const jour = (instant: string) =>
    service['effectiveTodayKey'](new Date(instant));

  it('rattache une seance de la nuit a la journee de la veille', () => {
    expect(jour('2026-08-22T01:30:00')).toBe('2026-08-21');
  });

  it('rattache une seance de la matinee au jour meme', () => {
    expect(jour('2026-08-22T07:15:00')).toBe('2026-08-22');
  });

  it('place la bascule a six heures pile', () => {
    expect(jour('2026-08-22T05:59:59')).toBe('2026-08-21');
    expect(jour('2026-08-22T06:00:00')).toBe('2026-08-22');
  });

  it('passe le changement de mois', () => {
    expect(jour('2026-09-01T02:00:00')).toBe('2026-08-31');
  });
});
