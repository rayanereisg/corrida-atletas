/**
 * Módulo: `ranking.js`
 * Calcula e retorna o ranking de atletas com base no tempo em segundos (campo `seg`).
 * Exporta: computeRanking(atletas, topN = 3) -> Array de atletas ordenados.
 */
// MÓDULO: RANKING
// Descrição: Funções responsáveis por calcular o ranking de atletas.

/**
 * Calcula o ranking de atletas baseando-se no tempo em segundos (campo `seg`).
 * Retorna os atletas ordenados por tempo ascendente e limitados a `topN`.
 * @param {Array<Object>} atletas - Lista de atletas
 * @param {number} [topN=3] - Quantos atletas retornar
 * @returns {Array<Object>} - Ranking ordenado
 */
export function computeRanking(atletas, topN = 3) {
    if (!Array.isArray(atletas)) return [];
    return atletas
        .filter(a => typeof a.seg === 'number' && !isNaN(a.seg))
        .slice() // copia para não mutar
        .sort((a, b) => a.seg - b.seg)
        .slice(0, topN);
}
