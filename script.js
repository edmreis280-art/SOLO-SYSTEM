const questionario = document.getElementById("questionario");
const punicao = document.getElementById("punicao");
const missoes = document.getElementById("missoes");
const timerEl = document.getElementById("timer");

function salvarQuestionario() {
  const atividade = document.getElementById("atividade").value;
  if (!atividade) return alert("Preencha tudo.");

  localStorage.setItem("nivel", atividade);
  iniciarDia();
}

function iniciarDia() {
  const ultimoDia = localStorage.getItem("ultimoDia");
  const agora = Date.now();

  if (!ultimoDia || agora - ultimoDia > 86400000) {
    localStorage.setItem("ultimoDia", agora);
    localStorage.setItem("completo", "false");
  }

  checarPunicao();
  atualizarTela();
  iniciarTimer();
}

function checarPunicao() {
  if (localStorage.getItem("completo") === "false") {
    gerarPunicao();
  }
}

function gerarPunicao() {
  const nivel = Number(localStorage.getItem("nivel"));
  const lista = document.getElementById("listaPunicao");
  lista.innerHTML = "";

  let reps = nivel * 10;

  ["Flexões", "Abdominais", "Agachamentos"].forEach(e => {
    const li = document.createElement("li");
    li.innerText = `${reps} ${e}`;
    lista.appendChild(li);
  });

  punicao.classList.remove("hidden");
  missoes.classList.add("hidden");
}

function concluirPunicao() {
  localStorage.setItem("completo", "true");
  punicao.classList.add("hidden");
  missoes.classList.remove("hidden");
}

function finalizarDia() {
  const checks = document.querySelectorAll(".missao");
  const feitas = [...checks].filter(c => c.checked).length;

  if (feitas < checks.length) {
    alert("Missões incompletas. Punição amanhã.");
    localStorage.setItem("completo", "false");
  } else {
    alert("Dia concluído. Sistema satisfeito.");
    localStorage.setItem("completo", "true");
  }

  localStorage.setItem("ultimoDia", Date.now());
}

function atualizarTela() {
  questionario.classList.add("hidden");
  missoes.classList.remove("hidden");
}

function iniciarTimer() {
  setInterval(() => {
    const ultimo = Number(localStorage.getItem("ultimoDia"));
    const restante = 86400000 - (Date.now() - ultimo);

    if (restante <= 0) {
      location.reload();
    }

    const h = Math.floor(restante / 3600000);
    const m = Math.floor((restante % 3600000) / 60000);
    timerEl.innerText = `⏳ Tempo restante: ${h}h ${m}m`;
  }, 60000);
}

window.onload = () => {
  if (localStorage.getItem("nivel")) iniciarDia();
};
