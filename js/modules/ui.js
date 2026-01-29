/**
 * Módulo: `ui.js`
 * Responsável por atualizar a interface, gerenciar navegação entre seções,
 * renderizar listas de atletas, inputs de tempo e exibir resultados/pódio.
 * Exporta funções: configurarNavegacao, atualizarLista, atualizarTempos, finalizarCorrida
 */
// =====================================================================================
// MÓDULO: UI (INTERFACE DO USUÁRIO)
// Descrição: Gerencia a atualização da interface, navegação e elementos visuais.
// =====================================================================================

import { getAtletas, removerAtleta, salvarAtletas, validarTempo } from './atletas.js';
import { computeRanking } from './ranking.js';
import { showModal } from './modal.js';

/**
 * Configura os event listeners para os botões do menu de navegação.
 * Permite alternar entre seções da aplicação.
 */
export function configurarNavegacao() {
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove a classe 'active' de todos os botões e seções
            document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

            // Adiciona 'active' ao botão clicado e à seção correspondente
            btn.classList.add('active');
            document.getElementById(btn.dataset.section + '-section').classList.add('active');
        });
    });
}

/**
 * Atualiza a lista de atletas na interface, criando elementos HTML dinamicamente.
 */
export function atualizarLista() {
    const lista = document.getElementById('lista-atletas');
    lista.innerHTML = '';

    const atletas = getAtletas();

    // Para cada atleta, cria um item de lista com botão de excluir
    atletas.forEach((a, i) => {
        const li = document.createElement('li');
        li.setAttribute('role', 'listitem');

        const texto = document.createElement('span');
        texto.textContent = `${a.nome} | Nº Peito: ${a.numeroPeito} | Distância: ${a.distancia}`;

        const btnExcluir = document.createElement('button');
        btnExcluir.textContent = '🗑️';
        btnExcluir.title = 'Excluir atleta';
        btnExcluir.setAttribute('aria-label', `Excluir atleta ${a.nome}`);
        btnExcluir.className = 'btn-excluir';
        btnExcluir.addEventListener('click', () => excluirAtleta(i));

        li.appendChild(texto);
        li.appendChild(btnExcluir);
        lista.appendChild(li);
    });
}

/**
 * Exclui um atleta da lista após confirmação do usuário.
 * Atualiza a interface e os inputs de tempo após a remoção.
 * @param {number} index - O índice do atleta a ser excluído.
 */
function excluirAtleta(index) {
    const atletas = getAtletas();
    const atleta = atletas[index];
    if (confirm(`Tem certeza que deseja excluir o atleta ${atleta.nome}?`)) {
        removerAtleta(index);
        atualizarLista();
        atualizarTempos();
    }
}

/**
 * Atualiza os inputs de tempo para cada atleta, criando selects dinamicamente.
 */
export function atualizarTempos() {
    const div = document.getElementById('tempos-inputs');
    div.innerHTML = '';

    const atletas = getAtletas();

    // Para cada atleta, adiciona selects para hora, minuto e segundo
    atletas.forEach((a, i) => {
        div.innerHTML += `
            <div class="tempo-input">
                <label>${a.nome} (${a.numeroPeito})</label>
                ${criarSelect(`hora-${i}`, 23, `Horas para ${a.nome}`)} : ${criarSelect(`min-${i}`, 59, `Minutos para ${a.nome}`)} : ${criarSelect(`seg-${i}`, 59, `Segundos para ${a.nome}`)}
            </div>
        `;
    });
}

/**
 * Cria um elemento select com opções de 0 a max.
 * Usa `padStart(2,'0')` para exibir valores com dois dígitos (00..max).
 * @param {string} id - O ID do select.
 * @param {number} max - O valor máximo para as opções.
 * @param {string} ariaLabel - O rótulo de acessibilidade.
 * @returns {string} - O HTML do select.
 */
function criarSelect(id, max, ariaLabel) {
    let html = `<select id="${id}" aria-label="${ariaLabel}">`;
    for (let j = 0; j <= max; j++) {
        html += `<option value="${j}">${j.toString().padStart(2, '0')}</option>`;
    }
    html += '</select>';
    return html;
}

/**
 * Calcula e exibe o ranking dos atletas baseado nos tempos registrados.
 */
export function finalizarCorrida() {
    const atletas = getAtletas();

    // Para cada atleta, obtém os valores dos selects e valida
    atletas.forEach((a, i) => {
        const h = parseInt(document.getElementById(`hora-${i}`).value);
        const m = parseInt(document.getElementById(`min-${i}`).value);
        const s = parseInt(document.getElementById(`seg-${i}`).value);
        if (h || m || s) {
            if (!validarTempo(h, m, s)) {
                showModal(`Tempo inválido para ${a.nome}: valores devem ser positivos e minutos/segundos ≤ 59.`);
                return;
            }
            a.tempo = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
            a.seg = h * 3600 + m * 60 + s;
        }
    });

    // Calcula ranking usando o módulo de ranking
    const ranking = computeRanking(atletas, 3);
    if (ranking.length === 0) {
        showModal('Nenhum tempo registrado para atletas.');
        return;
    }

    const res = document.getElementById('resultados');

    // Cria o elemento do pódio
    res.innerHTML = '<div class="podio"></div>';
    const podio = res.querySelector('.podio');

    // Para cada posição no ranking, adiciona um cartão no pódio
    ranking.forEach((a, i) => {
        podio.innerHTML += `
            <div class="podio-card lugar-${i+1}">
                <h3>${i+1}º Lugar</h3>
                <p>${a.nome}</p>
                <strong>${a.tempo}</strong>
            </div>
        `;
    });

    // Salva os dados atualizados no localStorage
    salvarAtletas();
}