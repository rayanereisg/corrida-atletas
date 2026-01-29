import { computeRanking } from '../js/modules/ranking.js';

describe('computeRanking', () => {
    test('ordena corretamente e retorna top N', () => {
        const atletas = [
            { nome: 'A', seg: 300 },
            { nome: 'B', seg: 200 },
            { nome: 'C', seg: 400 },
            { nome: 'D', seg: 250 }
        ];

        const top3 = computeRanking(atletas, 3);
        expect(top3).toHaveLength(3);
        expect(top3[0].nome).toBe('B');
        expect(top3[1].nome).toBe('D');
        expect(top3[2].nome).toBe('A');
    });

    test('ignora atletas sem tempo', () => {
        const atletas = [
            { nome: 'A' },
            { nome: 'B', seg: 100 }
        ];
        const result = computeRanking(atletas, 3);
        expect(result).toHaveLength(1);
        expect(result[0].nome).toBe('B');
    });

    test('retorna vazio para entrada inválida', () => {
        expect(computeRanking(null)).toEqual([]);
        expect(computeRanking(undefined)).toEqual([]);
    });
});