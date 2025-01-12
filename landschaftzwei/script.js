// Holen des Canvas-Elements und seines 2D-Kontexts
// Das Canvas-Element dient als Zeichenfläche, und der 2D-Kontext stellt die Funktionen zum Zeichnen bereit.
const canvas = document.getElementById('landscape');
const ctx = canvas.getContext('2d');

// Holen des Buttons, der die Animation steuert
const button = document.getElementById('moveFlowers');

// Setzen der Größe des Canvas auf die gesamte Fenstergröße
canvas.width = window.innerWidth; // Breite des Canvas entspricht der Fensterbreite
canvas.height = window.innerHeight; // Höhe des Canvas entspricht der Fensterhöhe

// Funktion zum Zeichnen des Himmels
function drawSky() {
  // Erstellen eines vertikalen Farbverlaufs (blau oben, weiß unten)
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height / 2);
  gradient.addColorStop(0, '#8B4513'); // Hellblau (oben)
  gradient.addColorStop(1, '#FFFFFF'); // Weiß (unten)
  ctx.fillStyle = gradient; // Festlegen des Farbverlaufs als Füllfarbe
  ctx.fillRect(0, 0, canvas.width, canvas.height / 2); // Rechteck für den Himmel zeichnen
}

// Funktion zum Zeichnen der Wiese
function drawGrass() {
  ctx.fillStyle = '#32CD32'; // Setzt die Füllfarbe auf ein helles Grün
  ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2); // Rechteck für die Wiese zeichnen (untere Hälfte des Canvas)
}

// Arrays zur Speicherung der Blumen und Wolken
const flowers = []; // Enthält die Positionen und Bewegungsdaten der Blumen
const clouds = [];  // Enthält die Positionen, Geschwindigkeiten und Größen der Wolken

// Konstante Anzahl von Blumen und Wolken
const flowerCount = 50; // Anzahl der Blumen
const cloudCount = 10;  // Anzahl der Wolken

// Funktion zur Initialisierung der Blumen
function initFlowers() {
  flowers.length = 0; // Löschen des Blumen-Arrays (falls zuvor Daten vorhanden waren)
  for (let i = 0; i < flowerCount; i++) {
    flowers.push({
      x: Math.random() * canvas.width, // Zufällige x-Position im Canvas
      y: canvas.height / 2 + Math.random() * (canvas.height / 2 - 40), // Zufällige y-Position im unteren Bereich
      sway: Math.random() * 2 + 1, // Geschwindigkeit des Schwankens
      offset: Math.random() * Math.PI * 2, // Anfangsphase des Schwankens
    });
  }
}

// Funktion zur Initialisierung der Wolken
function initClouds() {
  clouds.length = 0; // Löschen des Wolken-Arrays (falls zuvor Daten vorhanden waren)
  for (let i = 0; i < cloudCount; i++) {
    clouds.push({
      x: Math.random() * canvas.width, // Zufällige x-Position im Canvas
      y: Math.random() * canvas.height / 4, // Zufällige y-Position im oberen Viertel
      speed: Math.random() * 0.5 + 0.2, // Geschwindigkeit der Bewegung (langsames Gleiten)
      size: Math.random() * 50 + 50, // Zufällige Größe der Wolke
    });
  }
}

// Funktion zum Zeichnen einer einzelnen Blume
function drawFlower(x, y) {
  // Zeichnen des Stängels
  ctx.fillStyle = '#008000'; // Dunkelgrün für den Stängel
  ctx.fillRect(x - 2, y, 4, 40); // Schmaler vertikaler Balken

  // Zeichnen der Blütenblätter
  ctx.fillStyle = '#FF69B4'; // Rosa für die Blütenblätter
  for (let i = 0; i < 5; i++) { // 5 Blütenblätter
    const angle = (Math.PI * 2 / 5) * i; // Winkel zwischen den Blütenblättern
    const petalX = x + Math.cos(angle) * 10; // x-Koordinate des Blütenblatts
    const petalY = y + Math.sin(angle) * 10; // y-Koordinate des Blütenblatts
    ctx.beginPath();
    ctx.arc(petalX, petalY, 10, 0, Math.PI * 2); // Kreis für das Blütenblatt
    ctx.fill();
  }

  // Zeichnen der Blütenmitte
  ctx.fillStyle = '#FFD700'; // Goldgelb für die Mitte
  ctx.beginPath();
  ctx.arc(x, y, 7, 0, Math.PI * 2); // Kreis für die Mitte
  ctx.fill();
}

// Funktion zum Zeichnen einer einzelnen Wolke
function drawCloud(x, y, size) {
  ctx.fillStyle = 'white'; // Farbe der Wolken (weiß)
  ctx.beginPath();
  ctx.arc(x, y, size * 0.5, 0, Math.PI * 2); // Hauptteil der Wolke
  ctx.arc(x - size * 0.6, y, size * 0.4, 0, Math.PI * 2); // Linker Teil der Wolke
  ctx.arc(x + size * 0.6, y, size * 0.4, 0, Math.PI * 2); // Rechter Teil der Wolke
  ctx.fill(); // Zeichnet die Wolke
}

// Funktion zum Zeichnen der gesamten Landschaft
function drawLandscape() {
  drawSky(); // Himmel zeichnen
  clouds.forEach(cloud => drawCloud(cloud.x, cloud.y, cloud.size)); // Alle Wolken zeichnen
  drawGrass(); // Wiese zeichnen
  flowers.forEach(flower => drawFlower(flower.x, flower.y)); // Alle Blumen zeichnen
}

// Variable, die angibt, ob die Animation läuft
let animationActive = false;

// Funktion zur Animation der Szene
function animateScene() {
  if (!animationActive) return; // Wenn Animation deaktiviert, nichts tun

  ctx.clearRect(0, 0, canvas.width, canvas.height); // Löschen des gesamten Canvas
  drawLandscape(); // Landschaft erneut zeichnen

  // Blumen bewegen (schwanken)
  flowers.forEach(flower => {
    flower.x += Math.sin(flower.offset) * flower.sway; // Seitliches Schwanken der Blume
    flower.offset += 0.05; // Phase des Schwankens erhöhen
  });

  // Wolken bewegen (gleiten)
  clouds.forEach(cloud => {
    cloud.x += cloud.speed; // Wolke nach rechts bewegen
    if (cloud.x - cloud.size > canvas.width) {
      cloud.x = -cloud.size; // Wolke auf der linken Seite neu erscheinen lassen
    }
  });

  requestAnimationFrame(animateScene); // Nächsten Frame der Animation anfordern
}

// Event-Listener für den Button
button.addEventListener('click', () => {
  animationActive = !animationActive; // Animation umschalten (starten/stoppen)
  if (animationActive) {
    animateScene(); // Animation starten
    button.textContent = 'Animation stoppen'; // Button-Text ändern
  } else {
    button.textContent = 'Animation starten'; // Button-Text zurücksetzen
  }
});
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initFlowers();
  initClouds();
  drawLandscape();
});


// Initialisierung und erster Aufruf
initFlowers(); // Blumen initialisieren
initClouds(); // Wolken initialisieren
drawLandscape(); // Erste Darstellung der Landschaft

