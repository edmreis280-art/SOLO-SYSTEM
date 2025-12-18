let data = JSON.parse(localStorage.getItem("soloSystem")) || {
  iniciado: false,
  nivel: 1,
  xp: 0,
  level: 1,
  ultimoDia: Date.now(),
  punicao: false
};

function save() {
  localStorage.setItem("soloSystem", JSON.stringify(data));
}

function iniciarSistema() {
  const atividade = document.getElementById("atividade").value;
  if (!atividade) return alert("Complete o questionário.");

  data.iniciado = true;
  data.nivel = Number(atividade);
  data.ultimoDia = Date.now();
  save();
  load();
}

function load() {
  document.getElementById("level").innerText = data.level;
  document.getElementById("xp").innerText = data.xp;

  if (!data.iniciado) return show("questionario");

  if (data.punicao) ativarPunicao();
  else show("missoes");

  timer();
}

function show(id) {
  ["questionario", "punicao", "missoes"].forEach(s =>
    document.getElementById(s).classList.add("hidden")
  );
  document.getElementById(id).classList.remove("hidden");
}

function finalizarDia() {
  const miss = document.querySelectorAll(".missao");
  const feitas = [...miss].filter(m => m.checked).length;

  if (feitas < miss.length) {
    data.punicao = true;
  } else {
    data.xp += 20;
    if (data.xp >= 100) {
      data.xp = 0;
      data.level++;
    }
  }

  data.ultimoDia = Date.now();
  save();
  location.reload();
}

function ativarPunicao() {
  show("punicao");
  const ul = document.getElementById("listaPunicao");
  ul.innerHTML = "";
  const reps = data.nivel * 10;

  ["Flexões", "Abdominais", "Agachamentos"].forEach(e => {
    const li = document.createElement("li");
    li.textContent = `${reps} ${e}`;
    ul.appendChild(li);
  });
}

function concluirPunicao() {
  data.punicao = false;
  data.xp += 5;
  save();
  location.reload();
}

function timer() {
  setInterval(() => {
    const restante = 86400000 - (Date.now() - data.ultimoDia);
    if (restante <= 0) {
      data.punicao = true;
      save();
      location.reload();
    }
    const h = Math.floor(restante / 3600000);
    const m = Math.floor((restante % 3600000) / 60000);
    document.getElementById("timer").innerText = `${h}h ${m}m`;
  }, 60000);
}

window.onload = load;

