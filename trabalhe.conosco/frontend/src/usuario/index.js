import 'dotenv/config';

const token = localStorage.getItem('token');

// Redireciona para login se o usuário não estiver autenticado
if (!token) {
  alert('Você precisa fazer login para acessar esta página.');
  window.location.href = 'usuario/index.html';
}

// Função para carregar os dados do usuário logado
async function carregarUsuario() {
  try {
    const response = await fetch('http://localhost:5500/userdata/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const user = await response.json();

    if (user.success) {
      document.getElementById('user-photo').src = user.body.photo || 'img/default-user.png';
      document.getElementById('user-name').textContent = user.body.name;
      document.getElementById('user-position').textContent = user.body.position || 'Sem posição';
      document.getElementById('user-experience').textContent = user.body.experience || 'Sem experiência';
      document.getElementById('user-email').textContent = user.body.email;
      document.getElementById('user-phone').textContent = user.body.phone || 'Sem telefone';
      document.getElementById('user-address').textContent = user.body.address || 'Sem endereço';
      const availability = user.body.availability || [];
      const availabilityDiv = document.getElementById('user-availability');
      availabilityDiv.innerHTML = availability.map(item => `
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="${item}" checked disabled>
          <label class="form-check-label">${item}</label>
        </div>
      `).join('');
    }
  } catch (error) {
    console.error('Erro ao carregar os dados do usuário:', error);
  }
}

// Função para carregar vagas
async function carregarVagas() {
  try {
    const response = await fetch('http://localhost:5500/candidates', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const vagas = await response.json();

    if (vagas.success) {
      const vagasContainer = document.getElementById('vagas-container');
      vagasContainer.innerHTML = vagas.body.map(vaga => `
        <div class="vaga">
          <h3>${vaga.name}</h3>
          <p>${vaga.description}</p>
          <button onclick="inscreverVaga('${vaga._id}')">Inscrever-se</button>
        </div>
      `).join('');
    } else {
      alert('Erro ao carregar vagas: ' + vagas.body);
    }
  } catch (error) {
    console.error('Erro ao carregar vagas:', error);
    alert('Erro inesperado ao carregar vagas.');
  }
}

// Função para inscrever-se em uma vaga
document.addEventListener("DOMContentLoaded", async () => {
  const vagasContainer = document.getElementById("vagas-container");

  try {
    // Fazendo a requisição para buscar os trabalhos
    const response = await fetch("http://127.0.0.1:3001/works");
    if (!response.ok) {
      throw new Error("Erro ao buscar os trabalhos");
    }

    const { success, body: works } = await response.json();

    if (success && works.length > 0) {
      renderWorks(works);
    } else {
      vagasContainer.innerHTML = "<p>Nenhum trabalho encontrado.</p>";
    }
  } catch (error) {
    console.error(error);
    vagasContainer.innerHTML = "<p>Erro ao carregar os trabalhos. Tente novamente mais tarde.</p>";
  }
});

// Função para renderizar os trabalhos como cards
function renderWorks(works) {
  const vagasContainer = document.getElementById("vagas-container");

  const cards = works.map(work => {
    return `
      <div class="vaga">
        <h3>${work.nomeCliente}</h3>
        <p><strong>Carga Horária:</strong> ${work.cargaHoraria} horas</p>
        <p><strong>Valor:</strong> R$ ${work.valor.toFixed(2)}</p>
        <p><strong>Período:</strong> ${work.periodo}</p>
        <p><strong>Serviço:</strong> ${work.tipoServico}</p>
        <button class="btn-aceitar">Aceitar</button>
      </div>
    `;
  });

  vagasContainer.innerHTML = cards.join("");
}


// Carrega os dados do usuário e as vagas ao abrir a página
carregarUsuario();
