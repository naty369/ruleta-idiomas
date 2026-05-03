const languages = [
  "Portugués",
  "Inglés",
  "Francés",
  "Italiano",
  "Chino",
  "Ruso",
  "Árabe"
];

const colors = [
  "#3b82f6", // Azul (Portugués)
  "#22c55e", // Verde (Inglés)
  "#eab308", // Amarillo (Francés)
  "#06b6d4", // Cian/Turquesa (Italiano)
  "#f97316", // Naranja (Chino)
  "#ec4899", // Rosa (Ruso)
  "#8b5cf6"  // Violeta (Árabe)
];

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const radius = canvas.width / 2;

let angle = 0;
let lastTickIndex = -1; //sincroniza

function drawWheel() {
  const arc = (2 * Math.PI) / languages.length;

  for (let i = 0; i < languages.length; i++) {
    const start = i * arc;
    ctx.beginPath();
    ctx.fillStyle = colors[i];
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, start, start + arc);
    ctx.fill();

    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(start + arc / 2);
    ctx.fillStyle = "white";
    ctx.font = "14px Arial";
    ctx.fillText(languages[i], radius / 2, 5);
    ctx.restore();
  }
}

// 🔊 SONIDO DINÁMICO (sin archivo)
function playTickSound() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.type = "square";
  osc.frequency.setValueAtTime(800, audioCtx.currentTime);

  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.03);
}

function spinWheel() {
  const spinTime = Math.random() * 3000 + 2000;
  const start = performance.now();

  const finalAngle = (Math.random() * 4 + 6) * Math.PI;

  function animate(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / spinTime, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);

    angle = easeOut * finalAngle;
    drawRotatedWheel(angle);

    // 🔥 sincronización exacta con sectores
    const arc = (2 * Math.PI) / languages.length;
    const currentIndex = Math.floor((angle % (2 * Math.PI)) / arc);

    if (currentIndex !== lastTickIndex) {
      playTickSound();
      lastTickIndex = currentIndex;
    }

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      showResult();
    }
  }

  requestAnimationFrame(animate);
}

function drawRotatedWheel(rotation) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(radius, radius);
  ctx.rotate(rotation);
  ctx.translate(-radius, -radius);
  drawWheel();
  ctx.restore();
}

function showResult() {
  const arc = (2 * Math.PI) / languages.length;

  const adjustedAngle = (angle + Math.PI / 2) % (2 * Math.PI);

  const index = Math.floor((languages.length - adjustedAngle / arc)) % languages.length;

  document.getElementById("result").textContent =
    "Idioma seleccionado: " + languages[index];
}

drawWheel();
