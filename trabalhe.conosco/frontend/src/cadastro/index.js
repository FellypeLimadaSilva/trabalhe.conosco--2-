document.getElementById('cadastroForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const formacao = document.getElementById('formacao').value;
    const experiencia = document.getElementById('experiencia').value;
    const disponibilidade = [
        document.getElementById('manha').checked ? 'Manhã' : '',
        document.getElementById('tarde').checked ? 'Tarde' : '',
        document.getElementById('noite').checked ? 'Noite' : '',
    ].filter(Boolean);
    const cnh = document.getElementById('cnh').value;
    const endereco = document.getElementById('endereco').value;

    if (password !== confirmPassword) {
        alert('As senhas não conferem!');
        return;
    }

    const userData = {
        nome,
        email,
        telefone,
        password,
        formacao,
        experiencia,
        disponibilidade,
        cnh,
        endereco,
    };

    try {
        const response = await fetch('http://localhost:5500/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        const result = await response.json();
        if (result.success) {
            alert('Cadastro realizado com sucesso!');
            window.location.href = '../login/login.html';
        } else {
            alert('Erro no cadastro: ' + result.body.text);
        }
    } catch (error) {
        console.error('Erro ao cadastrar:', error);
        alert('Erro inesperado. Tente novamente.');
    }
});