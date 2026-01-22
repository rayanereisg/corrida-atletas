let atletas = JSON.parse(localStorage.getItem('atletas')) || [];

// Menu navigation
document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const section = this.getAttribute('data-section');
        showSection(section);
    });
});

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));
    
    // Show selected section
    document.getElementById(sectionId + '-section').classList.add('active');
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
}

document.getElementById('cadastro-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const nome = document.getElementById('nome').value;
    const numeroPeito = document.getElementById('numero-peito').value;
    const categoria = document.getElementById('categoria').value;
    const distancia = document.getElementById('distancia').value;

    // Verificar unicidade do número de peito
    if (atletas.some(atleta => atleta.numeroPeito == numeroPeito)) {
        alert('Número de peito já cadastrado. Escolha outro.');
        return;
    }

    atletas.push({ nome, numeroPeito, categoria, distancia, tempo: null });
    localStorage.setItem('atletas', JSON.stringify(atletas));
    atualizarLista();
    atualizarTempos();
    document.getElementById('nome').value = '';
    document.getElementById('numero-peito').value = '';
    document.getElementById('categoria').value = '';
    document.getElementById('distancia').value = '';
});

function atualizarLista() {
    const lista = document.getElementById('lista-atletas');
    lista.innerHTML = '';
    atletas.forEach((atleta, index) => {
        const li = document.createElement('li');
        li.textContent = `${atleta.nome} - Número: ${atleta.numeroPeito}${atleta.categoria ? ` - Categoria: ${atleta.categoria}` : ''}${atleta.distancia ? ` - Distância: ${atleta.distancia}` : ''}`;
        lista.appendChild(li);
    });
}

function atualizarTempos() {
    const section = document.getElementById('tempos-inputs');
    section.innerHTML = '';
    atletas.forEach((atleta, index) => {
        const div = document.createElement('div');
        div.className = 'tempo-input';
        div.innerHTML = `
            <label>${atleta.nome} (Número: ${atleta.numeroPeito}): Tempo (mm:ss)</label>
            <input type="text" id="tempo-${index}" placeholder="00:00" value="${atleta.tempo || ''}">
        `;
        section.appendChild(div);
    });
}

document.getElementById('finalizar').addEventListener('click', function() {
    atletas.forEach((atleta, index) => {
        const tempoInput = document.getElementById(`tempo-${index}`).value;
        if (tempoInput) {
            atleta.tempo = tempoInput;
        }
    });
    localStorage.setItem('atletas', JSON.stringify(atletas));

    // Filtrar atletas com tempo
    const comTempo = atletas.filter(a => a.tempo);
    // Converter tempo para segundos
    comTempo.forEach(a => {
        const [min, sec] = a.tempo.split(':').map(Number);
        a.tempoSeg = min * 60 + sec;
    });
    // Ordenar por tempo ascendente
    comTempo.sort((a, b) => a.tempoSeg - b.tempoSeg);
    // Top 3
    const top3 = comTempo.slice(0, 3);
    const resultados = document.getElementById('resultados');
    resultados.innerHTML = '<h3>Top 3 Colocados:</h3>';
    top3.forEach((atleta, i) => {
        resultados.innerHTML += `<p>${i+1}º: ${atleta.nome} - Tempo: ${atleta.tempo}</p>`;
    });
});

// Inicializar
atualizarLista();
atualizarTempos();