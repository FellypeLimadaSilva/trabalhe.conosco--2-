document.addEventListener("DOMContentLoaded", async () => {
    const vagasContainer = document.getElementById("vagas-container");

    try {
        const response = await fetch("http://localhost:5500/works");
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
        console.error("Erro ao buscar os trabalhos:", error);
        vagasContainer.innerHTML = "<p>Erro ao carregar os trabalhos. Tente novamente mais tarde.</p>";
    }
});

function renderWorks(works) {
    const vagasContainer = document.getElementById("vagas-container");

    const cards = works.map(work => {
        return `
            <div class="vaga" data-id="${work._id}">
                <h3>${work.nomeCliente}</h3>
                <p><strong>Carga Horária:</strong> ${work.cargaHoraria} horas</p>
                <p><strong>Valor:</strong> R$ ${parseFloat(work.valor).toFixed(2)}</p>
                <p><strong>Período:</strong> ${work.periodo}</p>
                <p><strong>Serviço:</strong> ${work.tipoServico}</p>
                <button class="btn-excluir">Excluir</button>
            </div>
        `;
    });

    vagasContainer.innerHTML = cards.join("");

    // Adicionar evento de clique para os botões de excluir
    document.querySelectorAll(".btn-excluir").forEach(button => {
        button.addEventListener("click", async (event) => {
            const vagaElement = event.target.closest(".vaga");
            const vagaId = vagaElement.getAttribute("data-id");

            try {
                const response = await fetch(`http://localhost:5500/works/${vagaId}`, {
                    method: "DELETE",
                });

                const result = await response.json();

                if (result.success) {
                    vagaElement.remove();
                } else {
                    alert("Erro ao excluir trabalho: " + result.message);
                }
            } catch (error) {
                console.error("Erro ao excluir trabalho:", error);
                alert("Erro ao excluir trabalho. Tente novamente mais tarde.");
            }
        });
    });
}