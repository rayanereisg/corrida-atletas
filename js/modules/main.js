// =====================================================================================
// MÓDULO PRINCIPAL: MAIN
// Descrição: Ponto de entrada da aplicação, configura event listeners e inicializa módulos.
// =====================================================================================

import { showModal, closeModal, configurarModal } from './modal.js';
import { carregarAtletas, salvarAtletas, adicionarAtleta, validarNome, validarNumeroPeito } from './atletas.js';
import { configurarNavegacao, atualizarLista, atualizarTempos, finalizarCorrida } from './ui.js';

// Aguarda o DOM carregar completamente antes de executar o código
document.addEventListener('DOMContentLoaded', () => {

    // =====================================================================================
    // INICIALIZAÇÃO DE MÓDULOS
    // =====================================================================================

    // Inicializa os atletas
    carregarAtletas();

    // Configura modal
    configurarModal();

    // Configura navegação
    configurarNavegacao();

    // =====================================================================================
    // EVENT LISTENERS PARA CADASTRO
    // =====================================================================================

    // Referências aos elementos de input do formulário
    const nomeInput = document.getElementById('nome');
    const numeroPeitoInput = document.getElementById('numero-peito');

    /**
     * Manipula o envio do formulário de cadastro de atletas.
     */
    function cadastrarAtleta(e) {
        console.log('Formulário de cadastro submetido');
        e.preventDefault();

        // Obtém os valores dos campos do formulário
        const nome = nomeInput.value.trim();
        const numeroPeito = numeroPeitoInput.value.trim();
        const categoria = document.getElementById('categoria').value;
        const distancia = document.getElementById('distancia').value;

        console.log('Valores:', { nome, numeroPeito, categoria, distancia });

        // Validação: Verifica se os campos obrigatórios estão preenchidos e válidos
        if (!validarNome(nome) || !validarNumeroPeito(numeroPeito)) {
            if (!validarNome(nome)) {
                showModal('Por favor, preencha o nome.');
            } else {
                showModal('Número de peito deve ser um número positivo único.');
            }
            return;
        }

        // Adiciona o novo atleta à lista
        adicionarAtleta({ nome, numeroPeito, categoria, distancia, tempo: null });
        console.log('Atleta adicionado');

        // Mostra mensagem de sucesso
        showModal('Atleta cadastrado com sucesso!');

        // Atualiza a lista e os inputs de tempos
        atualizarLista();
        atualizarTempos();

        // Reseta o formulário
        e.target.reset();
    }

    // Evento para submissão do formulário de cadastro
    document.getElementById('cadastro-form').addEventListener('submit', cadastrarAtleta);

    // Validação em tempo real para número de peito
    numeroPeitoInput.addEventListener('input', () => {
        const value = numeroPeitoInput.value;
        if (!validarNumeroPeito(value)) {
            numeroPeitoInput.setCustomValidity('Número de peito deve ser um número positivo único.');
            numeroPeitoInput.reportValidity();
        } else {
            numeroPeitoInput.setCustomValidity('');
        }
    });

    // Validação em tempo real para nome
    nomeInput.addEventListener('input', () => {
        const value = nomeInput.value.trim();
        if (!validarNome(value)) {
            nomeInput.setCustomValidity('Nome é obrigatório.');
            nomeInput.reportValidity();
        } else {
            nomeInput.setCustomValidity('');
        }
    });

    // =====================================================================================
    // EVENT LISTENERS PARA FINALIZAÇÃO
    // =====================================================================================

    // Evento para finalizar a corrida e calcular ranking
    document.getElementById('finalizar').addEventListener('click', finalizarCorrida);

    // =====================================================================================
    // INICIALIZAÇÃO DA INTERFACE
    // =====================================================================================

    // Inicializa a lista e os tempos ao carregar a página
    atualizarLista();
    atualizarTempos();

}); // Fim do DOMContentLoaded