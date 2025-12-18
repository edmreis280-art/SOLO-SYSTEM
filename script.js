let data = JSON.parse(localStorage.getItem("solo")) || {
  iniciado: false,
  nivelFisico: 1,
  xp: 0,
  level: 1,
  ultimoDia: Date.now(),
  punição: false
};

function salvar() {
  localStorage.setItem("solo", JSON.stringify(data));
}

function iniciarSistema() {
  const atividade = document.getElementById("atividade").value;
  if (!atividade) return alert("Preencha tudo.");

  data.iniciado = true;
  data.nivelFisico = Number(atividade);
  data.ultimoDia = Date.now();
  salvar();
  carregar();
}

function carregar() {
  document.getElementById("level").innerText = data.level;
  document.getElementById("xp").innerText = data.xp;

  if (!data.iniciado) {
    mostrar("questionario");
    return;
  }

  if (data.punição) {
    ativarPunicao();
  } else {
    mostrar("missoes");
  }

  iniciarTimer();
}

function mostrar(id) {
  ["questionario", "punicao", "missoes"].forEach(s =>
    document.getElementById(s).classList.add("hidden")
  );
  document.getElementById(id).classList.remove("hidden");
}

function finalizarDia() {
  const miss = document.querySelectorAll(".missao");
  const feitas = [...miss].filter(m => m.checked).length;

  if (feitas < miss.length) {
    data.punição = true;
  } else {
    data.xp += 20;
    if (data.xp >= 100) {
      data.xp = 0;
      data.level++;
    }
  }

  data.ultimoDia = Date.now();
  salvar();
  location.reload();
}

function ativarPunicao() {
  mostrar("punicao");
  const ul = document.getElementById("listaPunicao");
  ul.innerHTML = "";
  let reps = data.nivelFisico * 10;

  ["Flexões", "Abdominais", "Agachamentos"].forEach(e => {
    let li = document.createElement("li");
    li.innerText = `${reps} ${e}`;
    ul.appendChild(li);
  });
}

function concluirPunicao() {
  data.punição = false;
  data.xp += 5;
  salvar();
  location.reload();
}

function iniciarTimer() {
  setInterval(() => {
    let restante = 86400000 - (Date.now() - data.ultimoDia);
    if (restante <= 0) {
      data.punição = true;
      salvar();
      location.reload();
    }
    let h = Math.floor(restante / 3600000);
    let m = Math.floor((restante % 3600000) / 60000);
    document.getElementById("timer").innerText = `${h}h ${m}m`;
  }, 60000);
}

window.onload = carregar;
