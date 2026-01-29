/**
 * Módulo: `modal.js`
 * Responsável por exibir mensagens de notificação para o usuário.
 * Fornece: showModal(message), closeModal(), configurarModal().
 */
// =====================================================================================
// MÓDULO: MODAL (NOTIFICAÇÕES)
// Descrição: Gerencia a exibição e fechamento de modais de notificação.
// =====================================================================================

/**
 * Exibe um modal com uma mensagem de notificação.
 * @param {string} message - A mensagem a ser exibida no modal.
 */
export function showModal(message) {
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');
    modalMessage.textContent = message;
    modal.setAttribute('aria-hidden', 'false');
    document.getElementById('modal-close').focus();
}

/**
 * Fecha o modal de notificação.
 */
export function closeModal() {
    const modal = document.getElementById('modal');
    modal.setAttribute('aria-hidden', 'true');
}

/**
 * Configura os event listeners para o modal.
 */
export function configurarModal() {
    document.getElementById('modal-close').addEventListener('click', closeModal);
}