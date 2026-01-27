
// MÓDULO: ATLETAS (GERENCIAMENTO DE DADOS)
// Descrição: Gerencia o armazenamento, carregamento e validação de atletas.

/**
 * Array que armazena a lista de atletas.
 * Cada atleta é um objeto com propriedades: nome, numeroPeito, categoria, distancia, tempo, seg.
 * @type {Array<Object>}
 */
let atletas = [];

/**
 * Carrega a lista de atletas do localStorage ou inicializa com array vazio.
 */
export function carregarAtletas() {
    try {
        atletas = JSON.parse(localStorage.getItem('atletas')) || [];
    } catch (e) {
        console.warn('Erro ao carregar localStorage, usando array vazio:', e);
        atletas = [];
    }
}

/**
 * Salva a lista de atletas no localStorage.
 */
export function salvarAtletas() {
    try {
        localStorage.setItem('atletas', JSON.stringify(atletas));
    } catch (e) {
        console.error('Erro ao salvar no localStorage:', e);
        showModal('Erro ao salvar dados. Os dados podem não persistir.');
    }
}

/**
 * Adiciona um novo atleta à lista.
 * @param {Object} atleta - O objeto atleta a ser adicionado.
 */
export function adicionarAtleta(atleta) {
    atletas.push(atleta);
    salvarAtletas();
}

/**
 * Remove um atleta da lista pelo índice.
 * @param {number} index - O índice do atleta a ser removido.
 */
export function removerAtleta(index) {
    atletas.splice(index, 1);
    salvarAtletas();
}

/**
 * Retorna a lista de atletas.
 * @returns {Array<Object>} - A lista de atletas.
 */
export function getAtletas() {
    return atletas;
}

/**
 * Valida se o número de peito é único e positivo.
 * @param {string} numeroPeito - O número de peito a ser validado.
 * @returns {boolean} - True se válido, false caso contrário.
 */
export function validarNumeroPeito(numeroPeito) {
    const value = parseInt(numeroPeito);
    if (value <= 0 || isNaN(value)) {
        return false;
    }
    if (atletas.some(a => a.numeroPeito == value)) {
        return false;
    }
    return true;
}

/**
 * Valida se o nome não está vazio.
 * @param {string} nome - O nome a ser validado.
 * @returns {boolean} - True se válido, false caso contrário.
 */
export function validarNome(nome) {
    return nome.trim() !== '';
}

/**
 * Valida se o tempo é possível (não negativo e dentro de limites razoáveis).
 * @param {number} h - Horas.
 * @param {number} m - Minutos.
 * @param {number} s - Segundos.
 * @returns {boolean} - True se válido, false caso contrário.
 */
export function validarTempo(h, m, s) {
    if (h < 0 || m < 0 || s < 0 || m > 59 || s > 59) {
        return false;
    }
    // Limite máximo: 10 horas para uma corrida (extremo, mas possível)
    const totalSeg = h * 3600 + m * 60 + s;
    return totalSeg > 0 && totalSeg <= 36000;
}