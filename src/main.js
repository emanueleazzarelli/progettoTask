import "./style.css"

/* ---------- 1. STATO ---------- */
const CHIAVE = "todo-tasks"

function caricaStato() {
  const testo = localStorage.getItem(CHIAVE)
  if (testo === null) return []
  try {
    const dati = JSON.parse(testo)
    return Array.isArray(dati) ? dati : []
  } catch (errore) {
    console.error("Dati salvati non validi, riparto da zero:", errore.message)
    return []
  }
}

let tasks = caricaStato()

/* ---------- 2. RIFERIMENTI ALLA PAGINA ---------- */
const lista     = document.querySelector("#lista")
const info      = document.querySelector("#info")
const form      = document.querySelector("#form-task")
const campo     = document.querySelector("#campo-task")
const azioni    = document.querySelector("#azioni")    
const messaggio = document.querySelector("#messaggio")   
const box       = document.querySelector("#benvenuto")   

/* ---------- 3. PERSISTENZA ---------- */
function salvaStato() {
  localStorage.setItem(CHIAVE, JSON.stringify(tasks))
}

/* ---------- 4. VIEW ---------- */
function render() {
  lista.innerHTML = tasks
    .map(t => `
      <li class="${t.completed ? "fatto" : ""}" data-id="${t.id}">
        <span class="titolo">${t.title}</span>
        <button class="elimina" data-id="${t.id}">×</button>
      </li>
    `)
    .join("")

  const completati = tasks.filter(t => t.completed).length
  const daFare = tasks.filter(t => !t.completed).length
  info.textContent = `Totali: ${tasks.length} · Completati: ${completati} · Da fare: ${daFare}`

  const totali = tasks.length
  const restanti = totali - completati
  let frase
  if (totali === 0) {
    frase = "Non hai task. Buona giornata."
  } else if (restanti === 0) {
    frase = "Fatto tutto. Complimenti."
  } else {
    frase = `Ti restano ${restanti} task su ${totali}.`
  }
  messaggio.textContent = frase

  azioni.innerHTML = completati > 0
    ? `<button id="pulisci">Elimina completati (${completati})</button>`
    : ""
  const pulisci = document.querySelector("#pulisci")
  if (pulisci) {
    pulisci.addEventListener("click", deleteCompletati)
  }
}

const CHIAVE_NOME = "todo-nome"

function renderBenvenuto() {
  const nome = localStorage.getItem(CHIAVE_NOME)
  if (nome) {
    box.innerHTML = `<p>Bentornato, ${nome}</p>`
    return
  }
  box.innerHTML = `
    <input type="text" id="campo-nome" placeholder="Come ti chiami?">
    <button id="salva-nome">Salva</button>
  `
  document.querySelector("#salva-nome").addEventListener("click", () => {
    const valore = document.querySelector("#campo-nome").value.trim()
    if (valore === "") return
    localStorage.setItem(CHIAVE_NOME, valore)
    renderBenvenuto()          
  })
}

/* ---------- 5. AZIONI ---------- */
function aggiornaStato(nuoviTasks) {
  tasks = nuoviTasks
  salvaStato()
  render()
}

function addTask(title) {
  const pulito = title.trim()
  if (pulito === "") return
  aggiornaStato([...tasks, { id: Date.now(), title: pulito, completed: false }])
}

function toggleTask(id) {
  aggiornaStato(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
}

function deleteTask(id) {
  aggiornaStato(tasks.filter(t => t.id !== id))
}

function deleteCompletati() {
  if (!confirm("Elimino tutti i task completati?")) return
  tasks = tasks.filter(t => !t.completed) 
  salvaStato()
  render()
}



/* ---------- 6. EVENTI ---------- */
form.addEventListener("submit", (evento) => {
  evento.preventDefault()
  addTask(campo.value)
  campo.value = ""
  campo.focus()
})

lista.addEventListener("click", (evento) => {
  const elemento = evento.target
  if (elemento.classList.contains("elimina")) {
    deleteTask(Number(elemento.dataset.id))
    return
  }
  const riga = elemento.closest("li")
  if (riga) toggleTask(Number(riga.dataset.id))
})

/* ---------- 7. AVVIO ---------- */
renderBenvenuto()
render()
