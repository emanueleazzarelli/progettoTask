import "./style.css"

/* ---------- 1. STATO ---------- */
let tasks = [
  { id: 1, title: "Studiare per la verifica", completed: false },
  { id: 2, title: "Comprare il pane", completed: true },
  { id: 3, title: "Finire il progetto TPSIT", completed: false },
  { id: 4, title: "Portare fuori il cane", completed: false } 
]

/* ---------- 2. RIFERIMENTI ALLA PAGINA ---------- */
const lista = document.querySelector("#lista")
const info  = document.querySelector("#info")

/* ---------- 3. VIEW ---------- */
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
  info.textContent = `Totali: ${tasks.length} · Completati: ${completati} · da fare: ${daFare}`
  
}

/* ---------- 4. AVVIO ---------- */
render()