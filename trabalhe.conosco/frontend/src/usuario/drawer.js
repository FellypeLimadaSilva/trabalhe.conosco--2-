document.addEventListener("DOMContentLoaded", () => {
    const drawerToggle = document.getElementById("drawer-toggle");
    const drawer = document.getElementById("drawer");
  
    if (drawerToggle && drawer) {
      // Abre/fecha o drawer
      drawerToggle.addEventListener("click", () => {
        drawer.classList.toggle("open");
      });
    
      // Fecha o drawer quando clicado fora
      document.addEventListener("click", (event) => {
        if (!drawer.contains(event.target) && !drawerToggle.contains(event.target)) {
          drawer.classList.remove("open");
        }
      });
    }
  });
  

document.addEventListener('DOMContentLoaded', async () => {

    const token = localStorage.getItem('token');
  
    if (!token) {
      console.error('Token não encontrado. Usuário não autenticado.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5500/userdata/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        console.error('Erro ao buscar dados do usuário:', response.statusText);
        return;
      }
  
      const data = await response.json();
  
      if (data.success) {
    
        updateDrawer(data.body);
      } else {
        console.error('Erro na resposta da API:', data.message);
      }
    } catch (error) {
      console.error('Erro ao fazer requisição:', error);
    }
  });
  function updateDrawer(user) {
    document.getElementById('user-name').textContent = user.nome || 'Nome não disponível';
    //document.getElementById('user-position').textContent = user.position || 'Sem posição';
    document.getElementById('user-experience').textContent = user.experiencia || 'Sem experiência';
  
    const availabilityContainer = document.getElementById('user-availability');
    availabilityContainer.innerHTML = ''; 
    (user.disponibilidade || []).forEach(time => {
      const availabilityItem = document.createElement('span');
      availabilityItem.style.marginRight = '10px';
      availabilityItem.textContent = time;
      availabilityContainer.appendChild(availabilityItem);
    });
  
    document.getElementById('user-email').textContent = `Email: ${user.email || 'Não disponível'}`;
    document.getElementById('user-phone').textContent = `Telefone: ${user.telefone || 'Não disponível'}`;
    document.getElementById('user-address').textContent = `Endereço: ${user.endereco || 'Não disponível'}`;
  
    const userPhoto = document.getElementById('user-photo');
    if (user.photo) {
      userPhoto.src = user.photo;
      userPhoto.alt = `Foto de ${user.name}`;
    } else {
      userPhoto.src = '../img/coracao.webp';
      userPhoto.alt = 'Foto padrão do usuário';
    }
  }