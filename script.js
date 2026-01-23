// Aguarda o DOM carregar completamente antes de executar o código
document.addEventListener('DOMContentLoaded', () => {

// Inicializa a lista de atletas a partir do localStorage, ou uma lista vazia se não houver dados
let atletas = JSON.parse(localStorage.getItem('atletas')) || [];

// Navegação: Adiciona event listeners aos botões do menu para alternar entre seções
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

// Cadastro: Manipula o envio do formulário de cadastro de atletas
document.getElementById('cadastro-form').addEventListener('submit', e => {
    console.log('Formulário de cadastro submetido');
    e.preventDefault();

    // Obtém os valores dos campos do formulário
    const nome = nomeInput.value.trim();
    const numeroPeito = numeroPeitoInput.value.trim();
    const categoria = document.getElementById('categoria').value;
    const distancia = document.getElementById('distancia').value;

    console.log('Valores:', { nome, numeroPeito, categoria, distancia });

    // Validação: Verifica se os campos obrigatórios estão preenchidos
    if (!nome || !numeroPeito) {
        alert('Por favor, preencha o nome e o número de peito.');
        return;
    }

    // Verifica se o número de peito já existe
    if (atletas.some(a => a.numeroPeito == numeroPeito)) {
        alert('Número de peito já existe');
        return;
    }

    // Adiciona o novo atleta à lista
    atletas.push({ nome, numeroPeito, categoria, distancia, tempo: null });
    console.log('Atleta adicionado:', atletas[atletas.length - 1]);
    // Salva no localStorage
    localStorage.setItem('atletas', JSON.stringify(atletas));

    // Mostra mensagem de sucesso
    alert('Atleta cadastrado com sucesso!');

    // Atualiza a lista e os inputs de tempos
    atualizarLista();
    atualizarTempos();
    // Reseta o formulário
    e.target.reset();
});

// Referências aos elementos de input
const nomeInput = document.getElementById('nome');
const numeroPeitoInput = document.getElementById('numero-peito');

// Lista: Função para atualizar a lista de atletas na interface
function atualizarLista() {
    const lista = document.getElementById('lista-atletas');
    lista.innerHTML = '';
    // Para cada atleta, cria um item de lista
    atletas.forEach(a => {
        const li = document.createElement('li');
        li.textContent = `${a.nome} | Nº Peito: ${a.numeroPeito} | Distância: ${a.distancia}`;
        lista.appendChild(li);
    });
}

// Tempos: Função para atualizar os inputs de tempo para cada atleta
function atualizarTempos() {
    const div = document.getElementById('tempos-inputs');
    div.innerHTML = '';
    // Para cada atleta, adiciona selects para hora, minuto e segundo
    atletas.forEach((a,i) => {
        div.innerHTML += `
            <div class="tempo-input">
                <label>${a.nome} (${a.numeroPeito})</label>
                ${criarSelect(`hora-${i}`, 23)} : ${criarSelect(`min-${i}`, 59)} : ${criarSelect(`seg-${i}`, 59)}
            </div>
        `;
    });
}

// Função auxiliar para criar um select com opções de 0 a max
function criarSelect(id, max) {
    let html = `<select id="${id}">`;
    for (let j = 0; j <= max; j++) {
        html += `<option value="${j}">${j.toString().padStart(2, '0')}</option>`;
    }
    html += '</select>';
    return html;
}

// Finalizar: Evento para calcular e exibir o ranking dos atletas
document.getElementById('finalizar').addEventListener('click', () => {
    // Para cada atleta, obtém os valores dos selects e converte para segundos
    atletas.forEach((a,i) => {
        const h = parseInt(document.getElementById(`hora-${i}`).value);
        const m = parseInt(document.getElementById(`min-${i}`).value);
        const s = parseInt(document.getElementById(`seg-${i}`).value);
        if (h || m || s) {
            a.tempo = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
            a.seg = h * 3600 + m * 60 + s;
        }
    });

    // Filtra atletas com tempo, ordena por tempo e pega os top 3
    const ranking = atletas.filter(a => a.tempo).sort((a,b) => a.seg - b.seg).slice(0,3);
    const res = document.getElementById('resultados');

    // Cria o elemento do pódio
    res.innerHTML = '<div class="podio"></div>';
    const podio = res.querySelector('.podio');

    // Para cada posição no ranking, adiciona um cartão no pódio
    ranking.forEach((a,i) => {
        podio.innerHTML += `
            <div class="podio-card lugar-${i+1}">
                <h3>${i+1}º Lugar</h3>
                <p>${a.nome}</p>
                <strong>${a.tempo}</strong>
            </div>
        `;
    });

    // Salva os dados atualizados no localStorage
    localStorage.setItem('atletas', JSON.stringify(atletas));
});

// Inicializa a lista e os tempos ao carregar a página
atualizarLista();
atualizarTempos();

}); // Fim do DOMContentLoaded
