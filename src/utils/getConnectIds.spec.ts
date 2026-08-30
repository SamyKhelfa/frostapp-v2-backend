import { getConnectIds } from './getConnectIds';

describe('getConnectIds', () => {
  it('transforme une liste d ids en objets pour Prisma', () => {
    expect(getConnectIds([1, 2, 3])).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
  });

  it('renvoie un tableau vide quand la relation est absente', () => {
    expect(getConnectIds(undefined)).toEqual([]);
  });

  it('renvoie un tableau vide quand la liste est vide', () => {
    expect(getConnectIds([])).toEqual([]);
  });
});
