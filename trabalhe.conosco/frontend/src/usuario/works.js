 // Adicionando funcionalidade ao formulário
 document.getElementById("add-trabalho-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const trabalho = {
      nomeCliente: document.getElementById("nome-cliente").value,
      cargaHoraria: document.getElementById("carga-horaria").value,
      valor: document.getElementById("valor").value,
      periodo: document.getElementById("periodo").value,
      tipoServico: document.getElementById("tipo-servico").value,
    };

    try {
      const response = await fetch("http://127.0.0.1:5500/works/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trabalho),
      });

      if (response.ok) {
        alert("Trabalho adicionado com sucesso!");
        document.getElementById("add-trabalho-form").reset();
      } else {
        alert("Erro ao adicionar trabalho.");
      }
    } catch (error) {
      console.error("Erro ao conectar ao servidor:", error);
      alert("Erro ao adicionar trabalho.");
    }
  });