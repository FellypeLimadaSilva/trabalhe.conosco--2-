document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("Você precisa fazer login para acessar esta página.");
      window.location.href = "/login.html";
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5500/users/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json();
  
      if (response.ok && data.success) {
        renderUserList(data.body);
      } else {
        alert("Erro ao carregar a lista de usuários: " + data.body);
      }
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      alert("Erro inesperado ao carregar a lista de usuários.");
    }
  });
  
  function renderUserList(users) {
    const usersList = document.getElementById("users-list");
  
    if (!users.length) {
      usersList.innerHTML = "<p>Nenhum usuário encontrado.</p>";
      return;
    }
  
    usersList.innerHTML = users
      .map(
        (user) => `
      <div>
        <div class="user-card">
          <h2>${user.nome}</h2>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Telefone:</strong> ${user.telefone || "Não informado"}</p>
          <p><strong>Endereço:</strong> ${user.endereco || "Não informado"}</p>
          <p><strong>Papel:</strong> ${user.role === "admin"? "Administrador" : "Usuário"}</p>
        </div>
      </div>
    `
      )
      .join("");
  }
  