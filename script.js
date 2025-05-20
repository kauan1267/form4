<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Formulário Equipe Log</title>
  <link rel="stylesheet" href="style.css"/>
  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: url('background.jpg') no-repeat center center fixed;
      background-size: cover;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      overflow: hidden;
      color: white;
    }

    #form-container {
      background-color: rgba(0, 0, 0, 0.75);
      padding: 30px;
      border-radius: 10px;
      width: 90%;
      max-width: 600px;
      text-align: center;
    }

    #question-box {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    h1 {
      font-size: 2.5em;
      margin-bottom: 10px;
    }

    p.warning {
      font-size: 0.9em;
      color: #ccc;
      margin-bottom: 30px;
    }

    .form-group {
      margin-bottom: 20px;
      width: 100%;
    }

    label {
      font-size: 1.2em;
      display: block;
      margin-bottom: 10px;
    }

    input[type="text"],
    textarea,
    select {
      width: 100%;
      padding: 10px;
      border-radius: 5px;
      border: none;
      font-size: 1em;
    }

    button {
      padding: 12px 20px;
      background-color: #1e90ff;
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 1em;
      cursor: pointer;
      margin-top: 20px;
    }

    button:hover {
      background-color: #005cbf;
    }
  </style>
</head>
<body>
  <div id="form-container">
    <h1>Formulário Equipe LOG</h1>
    <p class="warning">⚠️ Proibido colar respostas — todas as perguntas devem ser respondidas de forma autoral.</p>
    <div id="question-box">
      <form id="logForm">
        <div class="form-group" id="pergunta-container"></div>
        <button type="button" id="nextButton">Próxima Pergunta</button>
      </form>
    </div>
  </div>

  <script>
    const perguntas = [
      { label: "Nome + ID Discord:", name: "nome_id", type: "text" },
      { label: "Qual seu horário disponível pra ajudar na log?", name: "horario", type: "text" },
      { label: "Atua em alguma área da staff? Se sim, quais?", name: "area_staff", type: "text" },
      { label: "Já teve experiência como Equipe. LOG? Se sim, me diga mais sobre.", name: "experiencia_log", type: "textarea" },
      { label: "Pra que serve o comando hackperma? E quando ele deve ser usado?", name: "hackperma", type: "textarea" },
      { label: "Em quais situações o propmanager seria ideal para achar hacker?", name: "propmanager", type: "textarea" },
      { label: "Pra que serve o delobjs? E em quais situações seria necessário usá-lo?", name: "delobjs", type: "textarea" },
      { label: "Pra que serve o forcedelete? E porque ele pode ser usado quando o delobjs não funcionar?", name: "forcedelete", type: "textarea" },
      { label: "Como você poderia achar o hack que usa função do mod menu pra falar alto?", name: "modmenu", type: "textarea" },
      { label: "Se você banir um hacker e ele não for kikado da cidade, o que você poderia fazer?", name: "ban_nao_kickado", type: "textarea" },
      { label: "Se você ver um hacker zaralhando na cidade, o que você faria?", name: "hacker_zaralho", type: "textarea" },
      { label: "Está ciente que terá uma meta semanal de 50 banimentos?", name: "meta_semanal", type: "select", options: ["Sim", "Não"] },
      { label: "Se alguém te marcar num ticket falando que o dinheiro dele sumiu, o que você faria?", name: "ticket_dinheiro", type: "textarea" }
    ];

    let current = 0;
    const form = document.getElementById("logForm");
    const container = document.getElementById("pergunta-container");
    const button = document.getElementById("nextButton");

    function mostrarPergunta(index) {
      container.innerHTML = "";
      const pergunta = perguntas[index];
      const label = document.createElement("label");
      label.textContent = pergunta.label;
      container.appendChild(label);

      let input;
      if (pergunta.type === "textarea") {
        input = document.createElement("textarea");
      } else if (pergunta.type === "select") {
        input = document.createElement("select");
        const optionDefault = document.createElement("option");
        optionDefault.value = "";
        optionDefault.textContent = "Selecione";
        input.appendChild(optionDefault);
        pergunta.options.forEach(opt => {
          const option = document.createElement("option");
          option.value = opt;
          option.textContent = opt;
          input.appendChild(option);
        });
      } else {
        input = document.createElement("input");
        input.type = pergunta.type;
      }

      input.name = pergunta.name;
      input.required = true;
      container.appendChild(input);
    }

    button.addEventListener("click", () => {
      const inputAtual = container.querySelector("input, textarea, select");
      if (!inputAtual.checkValidity()) {
        inputAtual.reportValidity();
        return;
      }
      const clone = inputAtual.cloneNode(true);
      clone.style.display = "none";
      form.insertBefore(clone, button);
      current++;
      if (current < perguntas.length) {
        mostrarPergunta(current);
      } else {
        button.textContent = "Enviar Formulário";
        button.type = "submit";
      }
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const webhookURL = "https://discord.com/api/webhooks/1374172908804374639/vjh2jNdi4AwfVHcUljAznB2P_hEZDNplrpUK80CiOpnqXXzmbq4rlN1vY9pqZvk7EGxs";

      let respostas = {};
      const inputs = form.querySelectorAll('input[name], textarea[name], select[name]');
      inputs.forEach(input => {
        respostas[input.name] = input.value.trim();
      });

      const fields = perguntas.map(p => ({
        name: p.label,
        value: respostas[p.name] ? respostas[p.name] : "Sem resposta",
        inline: false
      }));

      const payload = {
        embeds: [
          {
            title: "📋 Respostas do Formulário — Equipe LOG",
            color: 0x1e90ff,
            fields: fields,
            timestamp: new Date().toISOString(),
            footer: {
              text: "Formulário enviado via Webhook"
            }
          }
        ]
      };

      try {
        const response = await fetch(webhookURL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          alert("✅ Formulário enviado com sucesso para o Discord!");
          form.reset();
          current = 0;
          mostrarPergunta(current);
          button.textContent = "Próxima Pergunta";
          button.type = "button";
        } else {
          alert("❌ Erro ao enviar para o Discord. Tente novamente.");
        }
      } catch (error) {
        alert("⚠️ Erro na conexão: " + error.message);
      }
    });

    mostrarPergunta(current);
  </script>
</body>
</html>
