import { carregarAtletas, salvarAtletas, getAtletas, validarTempo, DATA_VERSION } from '../js/modules/atletas.js';

beforeEach(() => {
    localStorage.clear();
});

describe('atletas module', () => {
    test('validarTempo aceita tempos válidos e rejeita inválidos', () => {
        expect(validarTempo(0,30,0)).toBe(true);
        expect(validarTempo(0,0,0)).toBe(false); // zero não é permitido
        expect(validarTempo(-1,0,0)).toBe(false);
        expect(validarTempo(1,60,0)).toBe(false);
        expect(validarTempo(11,0,0)).toBe(false);
    });

    test('carregarAtletas migra array legado para formato versionado', () => {
        const legacy = [{ nome: 'Teste', numeroPeito: 1 }];
        localStorage.setItem('atletas', JSON.stringify(legacy));

        carregarAtletas();
        const loaded = getAtletas();
        expect(loaded).toEqual(legacy);

        // Depois da migração, localStorage deve conter o objeto com versão
        const raw = JSON.parse(localStorage.getItem('atletas'));
        expect(raw.version).toBe(DATA_VERSION);
        expect(raw.data).toEqual(legacy);
    });
});