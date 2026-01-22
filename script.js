let atletas = JSON.parse(localStorage.getItem('atletas')) || [];

// navegação
document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

        btn.classList.add('active');
        document.getElementById(btn.dataset.section + '-section').classList.add('active');
    });
});

// cadastro
document.getElementById('cadastro-form').addEventListener('submit', e => {
    e.preventDefault();

    const nome = nomeInput.value;
    const numeroPeito = numeroPeitoInput.value;
    const categoria = categoria.value;
    const distancia = distancia.value;

    if (atletas.some(a => a.numeroPeito == numeroPeito)) {
        alert('Número de peito já existe');
        return;
    }

    atletas.push({ nome, numeroPeito, categoria, distancia, tempo: null });
    localStorage.setItem('atletas', JSON.stringify(atletas));

    atualizarLista();
    atualizarTempos();
    e.target.reset();
});

const nomeInput = document.getElementById('nome');
const numeroPeitoInput = document.getElementById('numero-peito');

// lista
function atualizarLista() {
    const lista = document.getElementById('lista-atletas');
    lista.innerHTML = '';
    atletas.forEach(a => {
        const li = document.createElement('li');
        li.textContent = `${a.nome} | Peito ${a.numeroPeito}`;
        lista.appendChild(li);
    });
}

// tempos
function atualizarTempos() {
    const div = document.getElementById('tempos-inputs');
    div.innerHTML = '';
    atletas.forEach((a,i) => {
        div.innerHTML += `
            <div class="tempo-input">
                <label>${a.nome} (${a.numeroPeito})</label>
                <input type="text" id="tempo-${i}" placeholder="mm:ss">
            </div>
        `;
    });
}

document.getElementById('finalizar').addEventListener('click', () => {
    atletas.forEach((a,i) => {
        const v = document.getElementById(`tempo-${i}`).value;
        if (v) {
            a.tempo = v;
            const [m,s] = v.split(':').map(Number);
            a.seg = m * 60 + s;
        }
    });

    const ranking = atletas.filter(a => a.tempo).sort((a,b) => a.seg - b.seg).slice(0,3);
    const res = document.getElementById('resultados');

    res.innerHTML = '<div class="podio"></div>';
    const podio = res.querySelector('.podio');

    ranking.forEach((a,i) => {
        podio.innerHTML += `
            <div class="podio-card lugar-${i+1}">
                <h3>${i+1}º Lugar</h3>
                <p>${a.nome}</p>
                <strong>${a.tempo}</strong>
            </div>
        `;
    });

    localStorage.setItem('atletas', JSON.stringify(atletas));
});

atualizarLista();
atualizarTempos();
