// Adicionando evento ao formulário de login
document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Evita o comportamento padrão do formulário

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Faz a requisição de login para o back-end
        const response = await fetch('http://localhost:5500/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (result.success) {
            // Armazena o token no localStorage
            localStorage.setItem('token', result.body.token);

            // Verifica o papel do usuário
            if (result.body.user.role === 'admin') {
                // Redireciona para a página de administrador
                window.location.href = '../usuario/userslist.html';
            } else {
                // Redireciona para a página de usuário
                window.location.href = '../usuario/index.html';
            }
        } else {
            alert('Erro no login: ' + result.body.text);
        }
    } catch (error) {
        console.error('Erro na requisição de login:', error);
        alert('Erro na requisição de login');
    }
});