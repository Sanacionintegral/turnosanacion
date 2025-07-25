const endpoint = "https://script.google.com/macros/s/AKfycbwbB-n6Y5m5GUg8cSUd8PgZEWPLxefSkaMD1Eif9jbMqT1hvGvYuaeU4D0icRYwmijz/exec";
const whatsapp = "2235931151";
let turnos = [];
let reservados = [];

window.onload = async () => {
  try {
    const response = await fetch(endpoint);
    reservados = await response.json().then(data => data.map(t => t.toString().trim()));
    generarTurnosDisponibles();
    mostrarTurnos();
  } catch (error) {
    alert("Error al obtener los turnos reservados.");
  }
};

function generarTurnosDisponibles() {
  const fechas = [];
  const hoy = new Date();
  for (let i = 0; i < 14; i++) {
    const f = new Date(hoy);
    f.setDate(f.getDate() + i);
    if (f.getDay() !== 0) fechas.push(f);
  }

  let turnoNumero = 1;
  fechas.forEach((fecha) => {
    const bloques = generarBloques(fecha);
    bloques.forEach((hora) => {
      const diaTexto = formatoDia(fecha);
      const id = `T${turnoNumero}`.trim(); // <-- importante
      if (!reservados.includes(id)) {
        turnos.push({ nro: id, diaTexto, hora });
      }
      turnoNumero++;
    });
  });
}

function generarBloques(fecha) {
  const bloques = [];
  const inicio = fecha.getDay() === 6 ? 8 : 6;
  const fin = fecha.getDay() === 6 ? 16 : 20;
  for (let i = inicio; i < fin; i++) {
    bloques.push(`${i}:00`);
  }
  return bloques;
}

function formatoDia(fecha) {
  const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const diaSemana = dias[fecha.getDay()];
  const dia = fecha.getDate().toString().padStart(2, "0");
  const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
  const año = fecha.getFullYear();
  return `${diaSemana} - ${dia}/${mes}/${año}`;
}

function mostrarTurnos() {
  const contenedor = document.getElementById("turnos");
  contenedor.innerHTML = "";
  turnos.forEach((turno) => {
    const div = document.createElement("div");
    div.className = "turno";
    div.innerHTML = `
      <div><strong>${turno.diaTexto} - ${turno.hora}</strong></div>
      <button onclick="confirmarTurno('${turno.diaTexto}', '${turno.hora}')">Reservar turno</button>
    `;
    contenedor.appendChild(div);
  });
}

function confirmarTurno(dia, hora) {
  const nombre = prompt("Ingresá tu nombre:");
  if (!nombre) return alert("Debes completar tu nombre para continuar.");
  const mensajeWp = `Hola, quiero reservar una sesión energética para el ${dia} a las ${hora}. Mi nombre es ${nombre}.`;
  window.location.href = `https://wa.me/549${whatsapp}?text=${encodeURIComponent(mensajeWp)}`;
}

