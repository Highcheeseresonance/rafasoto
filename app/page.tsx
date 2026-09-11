"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Lang = "en" | "es";
type View = "splash" | "play" | "collection" | "about" | "contact" | "legal";

type Product = {
  id: string;
  name: string;
  designer: string;
  price: number;
  mode: "buy" | "drop";
  image?: string;
  mockupImage?: string;
  gallery?: ProductImage[];
  palette: string;
  line: Record<Lang, string>;
};

type CartItem = Product & { qty: number };

type ProductImage = {
  src: string;
  label: string;
};

const galleryFor = (id: string, labels: string[]): ProductImage[] =>
  labels.map((label, index) => ({
    src: `/assets/gallery/${id}-${String(index + 1).padStart(2, "0")}.jpg`,
    label,
  }));

const galleryItems = (id: string, items: Array<[number, string]>): ProductImage[] =>
  items.map(([index, label]) => ({
    src: `/assets/gallery/${id}-${String(index).padStart(2, "0")}.jpg`,
    label,
  }));

const copy = {
  en: {
    menu: "Menu",
    navPlay: "Play",
    navCollection: "The Collection",
    navAbout: "About",
    navContact: "Contact",
    navLegal: "Legal",
    cart: "Cart",
    heroKicker: "A small retail incident.",
    heroTitle: "Asteroids Supply",
    heroBody: "The only way to buy is to play. Break the right rocks, catch the words, then edit your basket like a civilized visitor.",
    play: "PLAY",
    collection: "THE COLLECTION",
    collectionTitle: "The Collection",
    collectionText: "Look closely. Nothing here sells itself. The machine decides when a word can leave.",
    foundAccess: "Catalogued",
    playToGet: "play to get the t-shirts",
    designer: "Designer",
    material: "Organic cotton.",
    gameTitle: "Play",
    gameText: "Break rocks until you find the shirt words. Each word you catch appears in the cart, where you can keep only the pieces you actually want.",
    gameHint: "Move, shoot, review the basket. Commerce, allegedly.",
    aboutTitle: "About",
    aboutText:
      "Asteroids Supply makes organic cotton T-shirts from words with no legal origin. The models are aliens. They are taking it seriously.",
    contactTitle: "Contact",
    contactText: "For orders, collaborations, strange sightings and normal emails.",
    legalTitle: "Legal",
    legalText: "Responsible company",
    legalCompany: "SACRAMENTO HEIGHTS SL",
    legalAddress: "CL. RAMBLA DE CATALUNYA, 32 4-2, 08007 BARCELONA, BARCELONA",
    legalNif: "NIF B64930241",
    email: "hello@asteroidssuppply.com",
    instagram: "@asteroidssupply",
    empty: "Nothing found.",
    subtotal: "Subtotal",
    checkout: "Checkout soon",
    clear: "Clear",
    sizes: "Sizes S-XXL",
    bilingual: "EN / ES",
  },
  es: {
    menu: "Menu",
    navPlay: "Play",
    navCollection: "The Collection",
    navAbout: "About",
    navContact: "Contact",
    navLegal: "Legal",
    cart: "Cesta",
    heroKicker: "Un pequeño incidente retail.",
    heroTitle: "Asteroids Supply",
    heroBody: "La única forma de comprar es jugar. Rompe las rocas correctas, caza las palabras y luego edita la cesta como una visita civilizada.",
    play: "PLAY",
    collection: "THE COLLECTION",
    collectionTitle: "The Collection",
    collectionText: "Mira con calma. Aquí nada se vende solo. La máquina decide cuándo sale una palabra.",
    foundAccess: "Catalogued",
    playToGet: "play to get the t-shirts",
    designer: "Diseñador",
    material: "Algodón orgánico.",
    gameTitle: "Play",
    gameText: "Rompe rocas hasta encontrar las palabras de las camisetas. Cada palabra cazada aparece en la cesta, donde puedes quedarte solo con las piezas que realmente quieres.",
    gameHint: "Muévete, dispara, revisa la cesta. Comercio, supuestamente.",
    aboutTitle: "About",
    aboutText:
      "Asteroids Supply hace camisetas de algodón orgánico a partir de palabras sin origen legal. Los modelos son aliens. Se lo están tomando en serio.",
    contactTitle: "Contact",
    contactText: "Para pedidos, colaboraciones, avistamientos raros y emails normales.",
    legalTitle: "Legal",
    legalText: "Empresa responsable",
    legalCompany: "SACRAMENTO HEIGHTS SL",
    legalAddress: "CL. RAMBLA DE CATALUNYA, 32 4-2, 08007 BARCELONA, BARCELONA",
    legalNif: "NIF B64930241",
    email: "hello@asteroidssuppply.com",
    instagram: "@asteroidssupply",
    empty: "Nada encontrado.",
    subtotal: "Subtotal",
    checkout: "Checkout pronto",
    clear: "Vaciar",
    sizes: "Tallas S-XXL",
    bilingual: "EN / ES",
  },
};

const products: Product[] = [
  {
    id: "sunriot",
    name: "Sunriot",
    designer: "Alvaro Jiménez",
    price: 34,
    mode: "buy",
    image: "/assets/sunriot.png",
    mockupImage: "/assets/sunriot-mockup.png",
    gallery: galleryFor("sunriot", ["Alien look 01", "Alien look 02", "Alien look 03", "T-shirt mockup"]),
    palette: "sun",
    line: {
      en: "For rooms with no shade.",
      es: "Para habitaciones sin sombra.",
    },
  },
  {
    id: "duskpop",
    name: "Duskpop",
    designer: "Marc Callao",
    price: 34,
    mode: "buy",
    image: "/assets/duskpop.png",
    mockupImage: "/assets/duskpop-mockup.png",
    gallery: galleryItems("duskpop", [
      [3, "Alien with bag"],
      [4, "Laundromat look"],
      [2, "Music look"],
      [1, "After-hours drink"],
      [5, "T-shirt mockup"],
    ]),
    palette: "dusk",
    line: {
      en: "Evening, overacting quietly.",
      es: "La tarde, sobreactuando en silencio.",
    },
  },
  {
    id: "daymelt",
    name: "Daymelt",
    designer: "Marco Rollo",
    price: 34,
    mode: "buy",
    image: "/assets/daymelt.png",
    mockupImage: "/assets/daymelt-mockup.png",
    gallery: galleryFor("daymelt", [
      "Alien look 01",
      "Alien look 02",
      "Alien look 03",
      "Alien look 04",
      "Front mockup",
      "Back mockup",
    ]),
    palette: "day",
    line: {
      en: "The day lost structure.",
      es: "El día perdió estructura.",
    },
  },
  {
    id: "soulspill",
    name: "Soulspill",
    designer: "Josep Basora",
    price: 34,
    mode: "buy",
    image: "/assets/soulspill.png",
    mockupImage: "/assets/soulspill-mockup.png",
    gallery: galleryFor("soulspill", [
      "Alien look 01",
      "Alien look 02",
      "Alien look 03",
      "Alien look 04",
      "Front mockup",
      "Back mockup",
    ]),
    palette: "soul",
    line: {
      en: "Private weather. Public shirt.",
      es: "Clima privado. Camiseta pública.",
    },
  },
  {
    id: "karmaggedon",
    name: "Karmaggedon",
    designer: "Teo Blanc",
    price: 34,
    mode: "buy",
    image: "/assets/karmaggedon.png",
    mockupImage: "/assets/karmaggedon-mockup.png",
    gallery: galleryFor("karmaggedon", ["Alien look 01", "Alien look 02", "Alien look 03", "T-shirt mockup"]),
    palette: "karma",
    line: {
      en: "Cause, effect, better spacing.",
      es: "Causa, efecto, mejor espaciado.",
    },
  },
  {
    id: "motelism",
    name: "Motelism",
    designer: "Victor Lavega",
    price: 34,
    mode: "buy",
    image: "/assets/motelism.png",
    mockupImage: "/assets/motelism-mockup.png",
    gallery: galleryItems("motelism", [
      [5, "Building look"],
      [4, "Round design look 01"],
      [6, "Round design look 02"],
      [7, "Round design look 03"],
      [8, "T-shirt mockup"],
    ]),
    palette: "motel",
    line: {
      en: "Leave the key. Keep the problem.",
      es: "Deja la llave. Quédate el problema.",
    },
  },
  {
    id: "brainglow",
    name: "Brainglow",
    designer: "Guillem Martín",
    price: 34,
    mode: "drop",
    image: "/assets/brainglow.jpg",
    mockupImage: "/assets/brainglow-mockup.jpg",
    gallery: galleryItems("brainglow", [
      [3, "Emergency look"],
      [1, "Alien look 01"],
      [2, "Alien lecture"],
      [4, "T-shirt mockup"],
    ]),
    palette: "brain",
    line: {
      en: "A thought with bad lighting.",
      es: "Un pensamiento con mala luz.",
    },
  },
  {
    id: "sunphony",
    name: "Sunphony",
    designer: "Miguel Payá",
    price: 34,
    mode: "drop",
    image: "/assets/sunphony.jpg",
    mockupImage: "/assets/sunphony-mockup.jpg",
    gallery: galleryFor("sunphony", ["Alien look 01", "Alien look 02", "Alien look 03", "Front mockup", "Back mockup"]),
    palette: "sunphony",
    line: {
      en: "Solar noise. Arranged politely.",
      es: "Ruido solar. Ordenado con educación.",
    },
  },
  {
    id: "driftique",
    name: "Driftique",
    designer: "Isabelita Virtual",
    price: 34,
    mode: "drop",
    image: "/assets/driftique.png",
    mockupImage: "/assets/driftique-mockup.png",
    gallery: galleryItems("driftique", [
      [4, "Foundry look"],
      [3, "Large ring"],
      [2, "Small ring"],
      [1, "With her"],
      [8, "T-shirt mockup"],
    ]),
    palette: "drift",
    line: {
      en: "Motion, pretending to be taste.",
      es: "Movimiento, fingiendo ser gusto.",
    },
  },
  {
    id: "moonjuice",
    name: "Moonjuice",
    designer: "DAQ",
    price: 34,
    mode: "drop",
    image: "/assets/moonjuice.png",
    mockupImage: "/assets/moonjuice-mockup.png",
    gallery: galleryFor("moonjuice", [
      "Alien look 01",
      "Alien look 02",
      "Alien look 03",
      "Alien look 04",
      "T-shirt mockup",
    ]),
    palette: "moon",
    line: {
      en: "Fluid for undisclosed bodies.",
      es: "Fluido para cuerpos no declarados.",
    },
  },
  {
    id: "doomsnack",
    name: "Doomsnack",
    designer: "Wete",
    price: 34,
    mode: "drop",
    image: "/assets/doomsnack.png",
    mockupImage: "/assets/doomsnack-mockup.png",
    gallery: galleryFor("doomsnack", ["Alien look 01", "Alien look 02", "Alien look 03", "T-shirt mockup"]),
    palette: "doom",
    line: {
      en: "Last bite. Good posture.",
      es: "Último bocado. Buena postura.",
    },
  },
];

type GameHud = {
  score: number;
  rocks: number;
  combo: number;
  status: string;
};

type AsteroidsGameProps = {
  onUnlock: (id: string) => void;
};

const gameWords = products.map((product) => ({
  id: product.id,
  word: product.name.toUpperCase(),
  colorMode: product.id === "karmaggedon" || product.id === "motelism" ? "grayscale" : "color",
}));

type WordDisplay = {
  text: string;
  x: number;
  y: number;
  life: number;
  timer: number;
  colors: {
    primary: string;
    shadow: string;
  };
};

function AsteroidsGame({ onUnlock }: AsteroidsGameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const keysRef = useRef<Record<string, boolean>>({});
  const touchTargetRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const runningRef = useRef(false);
  const shootRef = useRef<(() => void) | null>(null);
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [hud, setHud] = useState<GameHud>({
    score: 0,
    rocks: 0,
    combo: 1,
    status: "Waiting. Without enthusiasm.",
  });

  const start = () => {
    runningRef.current = true;
    setStarted(true);
    setGameOver(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const ship = { x: width / 2 - 17, y: height - 62, width: 34, height: 34, speed: 6 };
    const bullets: Array<{ x: number; y: number; width: number; height: number; speed: number }> = [];
    const asteroids: Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      rotation: number;
      rotationSpeed: number;
      points: Array<{ x: number; y: number }>;
      baseColor: string;
      lightColor: string;
      darkColor: string;
    }> = [];
    const particles: Array<{ x: number; y: number; vx: number; vy: number; life: number; color: string; size: number }> =
      [];
    const wordDisplays: WordDisplay[] = [];
    const stars = Array.from({ length: 90 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.8,
      speed: Math.random() * 0.55 + 0.18,
      twinkle: Math.random() * Math.PI * 2,
    }));

    let score = 0;
    let rocks = 0;
    let combo = 1;
    let comboTimer = 0;
    let elapsed = 0;
    let currentRamp = 0;
    let spawnTimer = 0;
    let wordCounter = 0;
    let sinceLastWord = 0;
    let nextDropIndex = 0;
    let shipActive = true;
    let localGameOver = false;
    let status = "Arrows move. Space shoots.";

    const publishHud = () => {
      setHud({ score, rocks, combo, status });
    };

    const moveShipTo = (targetX: number) => {
      ship.x = Math.max(10, Math.min(width - ship.width - 10, targetX - ship.width / 2));
    };

    const rectCircle = (
      rx: number,
      ry: number,
      rw: number,
      rh: number,
      cx: number,
      cy: number,
      cr: number,
    ) => {
      const testX = Math.max(rx, Math.min(cx, rx + rw));
      const testY = Math.max(ry, Math.min(cy, ry + rh));
      const dx = cx - testX;
      const dy = cy - testY;
      return dx * dx + dy * dy <= cr * cr;
    };

    const burst = (x: number, y: number, color = "#d9fb63", count = 18) => {
      for (let i = 0; i < count; i += 1) {
        const angle = (i / count) * Math.PI * 2;
        const speed = 1.6 + Math.random() * 4.2;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          color,
          size: 1.6 + Math.random() * 3.2,
        });
      }
    };

    const wordColors = (mode: string) => {
      if (mode === "grayscale") {
        const gray = 42 + Math.random() * 40;
        return {
          primary: `hsl(0, 0%, ${gray}%)`,
          shadow: `hsl(0, 0%, ${Math.max(12, gray - 30)}%)`,
        };
      }
      const hue = Math.random() * 360;
      return {
        primary: `hsl(${hue}, 86%, 65%)`,
        shadow: `hsl(${hue}, 70%, 30%)`,
      };
    };

    const wordBurst = (x: number, y: number, count = 30) => {
      const colors = ["#ff6b35", "#f7931e", "#ffd23f", "#06ffa5", "#1fb3d3", "#5d4e75", "#ff006e", "#8338ec"];
      for (let i = 0; i < count; i += 1) {
        const angle = (i / count) * Math.PI * 2;
        const speed = 3 + Math.random() * 5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 2 + Math.random() * 4,
        });
      }
    };

    const createAsteroid = (forceWord = false) => {
      void forceWord;
      const size = 15 + Math.random() * 25;
      const pointCount = 8 + Math.floor(Math.random() * 4);
      const points = Array.from({ length: pointCount }, (_, index) => {
        const angle = (index / pointCount) * Math.PI * 2;
        const radius = size * (0.7 + Math.random() * 0.3);
        return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
      });
      const grayValue = Math.random() * 40 + 40;

      asteroids.push({
        x: size + Math.random() * (width - size * 2),
        y: -size * 2,
        size,
        speed: (0.8 + Math.random() * 1.5) * (1 + 0.6 * currentRamp),
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.08,
        points,
        baseColor: `hsl(200, 15%, ${grayValue}%)`,
        lightColor: `hsl(200, 25%, ${grayValue + 15}%)`,
        darkColor: `hsl(200, 10%, ${grayValue - 20}%)`,
      });
    };

    const reset = () => {
      runningRef.current = true;
      score = 0;
      rocks = 0;
      combo = 1;
      comboTimer = 0;
      elapsed = 0;
      currentRamp = 0;
      spawnTimer = 0;
      wordCounter = 0;
      sinceLastWord = 0;
      nextDropIndex = 0;
      ship.x = width / 2 - 17;
      shipActive = true;
      localGameOver = false;
      bullets.length = 0;
      asteroids.length = 0;
      particles.length = 0;
      wordDisplays.length = 0;
      status = "Arrows move. Space shoots.";
      setGameOver(false);
      publishHud();
      createAsteroid(true);
    };

    const shoot = () => {
      if (!runningRef.current || localGameOver || !shipActive) {
        if (localGameOver) reset();
        return;
      }
      bullets.push({ x: ship.x + ship.width / 2 - 1.4, y: ship.y, width: 2.8, height: 12, speed: 10 });
    };
    shootRef.current = shoot;

    const endGame = () => {
      shipActive = false;
      localGameOver = true;
      runningRef.current = false;
      asteroids.length = 0;
      burst(ship.x + ship.width / 2, ship.y + ship.height / 2, "#efede3", 50);
      status = "K.O. Space or Begin restarts.";
      setGameOver(true);
      publishHud();
    };

    const update = () => {
      if (!runningRef.current && !localGameOver) return;

      elapsed += 0.016;
      currentRamp = Math.min(1, elapsed / 120);
      sinceLastWord += 0.016;
      spawnTimer += 0.016;
      comboTimer = Math.max(0, comboTimer - 0.016);
      if (comboTimer <= 0) combo = 1;

      if (runningRef.current && shipActive) {
        if (touchTargetRef.current !== null) moveShipTo(touchTargetRef.current);
        if (keysRef.current.ArrowLeft && ship.x > 10) ship.x -= ship.speed;
        if (keysRef.current.ArrowRight && ship.x < width - ship.width - 10) ship.x += ship.speed;
      }

      for (let i = bullets.length - 1; i >= 0; i -= 1) {
        bullets[i].y -= bullets[i].speed;
        if (bullets[i].y < -20) bullets.splice(i, 1);
      }

      for (let i = asteroids.length - 1; i >= 0; i -= 1) {
        const asteroid = asteroids[i];
        asteroid.y += asteroid.speed;
        asteroid.rotation += asteroid.rotationSpeed;
        if (asteroid.y > height + asteroid.size) {
          asteroids.splice(i, 1);
          continue;
        }
        if (
          runningRef.current &&
          shipActive &&
          rectCircle(ship.x, ship.y, ship.width, ship.height, asteroid.x, asteroid.y, asteroid.size * 0.9)
        ) {
          endGame();
          return;
        }
      }

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.98;
        particle.vy *= 0.98;
        particle.life -= 0.025;
        if (particle.life <= 0) particles.splice(i, 1);
      }

      for (let i = bullets.length - 1; i >= 0; i -= 1) {
        const bullet = bullets[i];
        for (let j = asteroids.length - 1; j >= 0; j -= 1) {
          const asteroid = asteroids[j];
          if (rectCircle(bullet.x, bullet.y, bullet.width, bullet.height, asteroid.x, asteroid.y, asteroid.size)) {
            rocks += 1;
            wordCounter += 1;
            combo = comboTimer > 0 ? Math.min(5, combo + 1) : 1;
            comboTimer = 2.5;
            score += 10 * combo;
            const hasWord = wordCounter >= 3 || sinceLastWord > 25;
            if (hasWord) {
              const wordData = gameWords[(nextDropIndex + Math.floor(Math.random() * gameWords.length)) % gameWords.length];
              nextDropIndex += 1;
              wordBurst(asteroid.x, asteroid.y);
              wordDisplays.push({
                text: wordData.word,
                x: Math.max(120, Math.min(width - 120, asteroid.x)),
                y: Math.max(60, Math.min(height - 80, asteroid.y)),
                life: 1.8,
                timer: 0,
                colors: wordColors(wordData.colorMode),
              });
              onUnlock(wordData.id);
              status = `${wordData.word} found. Continue.`;
              wordCounter = 0;
              sinceLastWord = 0;
            } else {
              burst(asteroid.x, asteroid.y, asteroid.baseColor, 12);
              burst(asteroid.x, asteroid.y, asteroid.lightColor, 6);
              status = "No word. A normal rock.";
            }
            bullets.splice(i, 1);
            asteroids.splice(j, 1);
            break;
          }
        }
      }

      for (let i = wordDisplays.length - 1; i >= 0; i -= 1) {
        const display = wordDisplays[i];
        display.timer += 0.016;
        display.y -= 0.18;
        display.life = display.timer < 1.15 ? 1 : Math.max(0, 1 - (display.timer - 1.15) / 0.45);
        if (display.life <= 0) wordDisplays.splice(i, 1);
      }

      if (runningRef.current && spawnTimer > 0.72) {
        spawnTimer = 0;
        if (Math.random() < 0.5) createAsteroid(wordCounter >= 3);
      }

      if (runningRef.current && asteroids.length === 0) createAsteroid(wordCounter >= 2);

      for (const star of stars) {
        star.y += star.speed;
        star.twinkle += 0.08;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }
      }

      if (Math.floor(elapsed * 12) % 4 === 0) publishHud();
    };

    const draw = () => {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height);

      for (const star of stars) {
        ctx.globalAlpha = 0.45 + Math.sin(star.twinkle) * 0.35;
        ctx.fillStyle = "#efede3";
        ctx.fillRect(star.x, star.y, star.size, star.size);
      }
      ctx.globalAlpha = 1;

      ctx.strokeStyle = "rgba(239,237,227,0.16)";
      ctx.strokeRect(10, 10, width - 20, height - 20);

      if (!localGameOver && shipActive) {
        const x = Math.floor(ship.x);
        const y = Math.floor(ship.y);
        ctx.fillStyle = "#00ff00";
        ctx.fillRect(x + 11, y + 22, 12, 12);
        ctx.fillStyle = "#00cc00";
        ctx.fillRect(x + 5, y + 28, 6, 6);
        ctx.fillRect(x + 23, y + 28, 6, 6);
        ctx.fillStyle = "#00ffff";
        ctx.fillRect(x + 14, y + 17, 6, 6);
        ctx.fillStyle = "#ff6600";
        ctx.fillRect(x + 8, y + 34, 3, 3);
        ctx.fillRect(x + 23, y + 34, 3, 3);
        ctx.fillStyle = "#ffff00";
        ctx.fillRect(x + 14, y + 34, 6, 3);
        ctx.fillStyle = "#00ff00";
        ctx.fillRect(x + 15, y + 11, 3, 6);
      }

      ctx.fillStyle = "#ffff00";
      for (const bullet of bullets) ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

      for (const asteroid of asteroids) {
        ctx.save();
        ctx.translate(asteroid.x, asteroid.y);
        ctx.rotate(asteroid.rotation);
        ctx.fillStyle = asteroid.darkColor;
        ctx.beginPath();
        ctx.moveTo(asteroid.points[0].x + 1, asteroid.points[0].y + 1);
        for (let i = 1; i < asteroid.points.length; i += 1) ctx.lineTo(asteroid.points[i].x + 1, asteroid.points[i].y + 1);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = asteroid.baseColor;
        ctx.beginPath();
        ctx.moveTo(asteroid.points[0].x, asteroid.points[0].y);
        for (let i = 1; i < asteroid.points.length; i += 1) ctx.lineTo(asteroid.points[i].x, asteroid.points[i].y);
        ctx.closePath();
        ctx.fill();
        if (asteroid.points.length > 1) {
          ctx.fillStyle = asteroid.lightColor;
          ctx.beginPath();
          ctx.moveTo(asteroid.points[0].x, asteroid.points[0].y);
          ctx.lineTo(asteroid.points[1].x, asteroid.points[1].y);
          ctx.lineTo(asteroid.points[1].x - 2, asteroid.points[1].y - 2);
          ctx.lineTo(asteroid.points[0].x - 2, asteroid.points[0].y - 2);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      for (const particle of particles) {
        ctx.globalAlpha = Math.max(0, particle.life);
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
      }
      ctx.globalAlpha = 1;

      for (const display of wordDisplays) {
        ctx.save();
        ctx.globalAlpha = display.life;
        const scale = 1 + Math.sin(display.timer * 8) * 0.04;
        ctx.translate(display.x, display.y);
        ctx.scale(scale, scale);
        ctx.font = "700 28px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.lineWidth = 5;
        ctx.strokeStyle = display.colors.shadow;
        ctx.strokeText(display.text, 0, 0);
        ctx.fillStyle = display.colors.primary;
        ctx.fillText(display.text, 0, 0);
        ctx.restore();
      }

      if (!started) {
        ctx.fillStyle = "rgba(3,4,4,0.72)";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#efede3";
        ctx.font = "28px Arial";
        ctx.textAlign = "center";
        ctx.fillText("UNREGISTERED WORDS", width / 2, height / 2 - 12);
        ctx.font = "14px monospace";
        ctx.fillStyle = "#a7a092";
        ctx.fillText("Tap to shoot. Drag to move.", width / 2, height / 2 + 24);
      }

      if (localGameOver) {
        ctx.fillStyle = "rgba(3,4,4,0.68)";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#efede3";
        ctx.font = "42px Arial";
        ctx.textAlign = "center";
        ctx.fillText("K.O", width / 2, height / 2 - 8);
        ctx.font = "14px monospace";
        ctx.fillStyle = "#a7a092";
        ctx.fillText("Space restarts. Maintain composure.", width / 2, height / 2 + 30);
      }
    };

    const loop = () => {
      update();
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };

    const keyDown = (event: KeyboardEvent) => {
      if (event.code === "ArrowLeft" || event.code === "ArrowRight" || event.code === "Space") event.preventDefault();
      keysRef.current[event.code] = true;
      if (event.code === "Space") {
        if (!started) start();
        else shoot();
      }
    };
    const keyUp = (event: KeyboardEvent) => {
      keysRef.current[event.code] = false;
    };

    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    createAsteroid(true);
    publishHud();
    loop();

    return () => {
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [onUnlock, started]);

  const aimWithPointer = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
    touchTargetRef.current = x;
  };

  const handleCanvasPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    aimWithPointer(event);
    if (gameOver) {
      shootRef.current?.();
      return;
    }
    if (!started) start();
    shootRef.current?.();
  };

  const handleCanvasPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (event.buttons !== 1) return;
    event.preventDefault();
    aimWithPointer(event);
  };

  const handleCanvasPointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    touchTargetRef.current = null;
  };

  return (
    <div className="game-shell">
      <div className="game-topline">
        <span>
          Score <strong>{hud.score}</strong>
        </span>
        <span>
          Rocks <strong>{hud.rocks}</strong>
        </span>
        <span>
          Combo <strong>x{hud.combo}</strong>
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        aria-label="Asteroids Supply drop game"
        onPointerDown={handleCanvasPointerDown}
        onPointerMove={handleCanvasPointerMove}
        onPointerUp={handleCanvasPointerUp}
        onPointerCancel={handleCanvasPointerUp}
      />
      <div className="game-status">
        <span>{hud.status}</span>
        <button onClick={() => (gameOver ? shootRef.current?.() : start())}>
          {gameOver ? "Restart" : started ? "Resume" : "Begin"}
        </button>
      </div>
      <div className="touch-controls" aria-label="Touch game controls">
        <button
          onPointerDown={() => {
            keysRef.current.ArrowLeft = true;
          }}
          onPointerUp={() => {
            keysRef.current.ArrowLeft = false;
          }}
          onPointerLeave={() => {
            keysRef.current.ArrowLeft = false;
          }}
          aria-label="Move left"
        >
          ◀
        </button>
        <button
          onPointerDown={() => {
            shootRef.current?.();
          }}
          aria-label="Shoot"
        >
          ●
        </button>
        <button
          onPointerDown={() => {
            keysRef.current.ArrowRight = true;
          }}
          onPointerUp={() => {
            keysRef.current.ArrowRight = false;
          }}
          onPointerLeave={() => {
            keysRef.current.ArrowRight = false;
          }}
          aria-label="Move right"
        >
          ▶
        </button>
      </div>
    </div>
  );
}

function ProductGallery({ product }: { product: Product }) {
  const fallbackGallery = [
    product.image && { src: product.image, label: "Alien look" },
    product.mockupImage && { src: product.mockupImage, label: "T-shirt mockup" },
  ].filter(Boolean) as ProductImage[];
  const gallery = product.gallery?.length ? product.gallery : fallbackGallery;
  const [index, setIndex] = useState(0);
  const active = gallery[index] ?? gallery[0];

  const move = (direction: number) => {
    setIndex((current) => (current + direction + gallery.length) % gallery.length);
  };

  if (!active) {
    return (
      <div className="word-plate">
        <span>{product.name}</span>
      </div>
    );
  }

  return (
    <>
      <img className="product-main-img" src={active.src} alt={`${product.name} ${active.label}`} />
      {gallery.length > 1 && (
        <div className="gallery-controls">
          <button
            className="gallery-arrow prev"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              move(-1);
            }}
            aria-label={`Previous ${product.name} image`}
          >
            ‹
          </button>
          <button
            className="gallery-arrow next"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              move(1);
            }}
            aria-label={`Next ${product.name} image`}
          >
            ›
          </button>
          <span className="gallery-caption">{active.label}</span>
          <span className="gallery-count">
            {index + 1}/{gallery.length}
          </span>
        </div>
      )}
    </>
  );
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [view, setView] = useState<View>("splash");
  const [menuOpen, setMenuOpen] = useState(false);
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const t = copy[lang];

  const cartItems = useMemo(() => Object.values(cart), [cart]);
  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const showView = useCallback((next: View) => {
    setView(next);
    setMenuOpen(false);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const unlockDrop = useCallback((id: string) => {
    const product = products.find((item) => item.id === id);
    if (!product) return;
    setCart((current) => {
      if (current[id]) return current;
      return {
        ...current,
        [id]: { ...product, qty: 1 },
      };
    });
  }, []);

  return (
    <main className={`site-shell view-${view}`}>
      <header className={`site-header ${view === "splash" ? "cover-header" : "solid-header"}`}>
        <button className="brand-mark" onClick={() => showView("splash")} aria-label="Asteroids Supply home">
          <img src="/assets/logo-as-blanco.png" alt="" />
        </button>
        <div className="header-actions">
          <button className="lang-switch" onClick={() => setLang(lang === "en" ? "es" : "en")}>
            {t.bilingual}
          </button>
          <button className="cart-button" onClick={() => setCartOpen(true)}>
            {t.cart} <span>{cartItems.reduce((sum, item) => sum + item.qty, 0)}</span>
          </button>
          <button
            className={`hamburger-button ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen((current) => !current)}
            aria-label={t.menu}
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
        <nav className={`menu-panel ${menuOpen ? "open" : ""}`} aria-label="Primary navigation">
          <button onClick={() => showView("play")}>{t.navPlay}</button>
          <button onClick={() => showView("collection")}>{t.navCollection}</button>
          <button onClick={() => showView("about")}>{t.navAbout}</button>
          <button onClick={() => showView("contact")}>{t.navContact}</button>
          <button onClick={() => showView("legal")}>{t.navLegal}</button>
        </nav>
      </header>

      {view === "splash" && (
        <section className="splash-cover" aria-label="Asteroids Supply game cover">
          <picture>
            <source media="(max-width: 700px)" srcSet="/assets/hero-mobile.jpeg" />
            <img src="/assets/hero-desktop.jpg" alt="Alien models wearing Asteroids Supply beside arcade machines" />
          </picture>
          <div className="splash-overlay" />
          <div className="splash-copy">
            <p>{t.heroKicker}</p>
            <h1>{t.heroTitle}</h1>
            <span>{t.heroBody}</span>
            <div className="splash-actions">
              <button onClick={() => showView("play")}>{t.play}</button>
              <button onClick={() => showView("collection")}>{t.collection}</button>
            </div>
          </div>
          <div className="cover-meta">
            <span>{products.length} words</span>
            <span>{t.material}</span>
          </div>
        </section>
      )}

      {view === "collection" && (
        <section className="screen-section collection-screen">
          <div className="section-heading">
            <div>
              <h2>{t.collectionTitle}</h2>
              <span>{t.collectionText}</span>
            </div>
          </div>
          <div className="product-grid">
            {products.map((product) => (
              <article className={`product-card ${product.palette}`} key={product.id}>
                <div className="product-image">
                  <ProductGallery product={product} />
                  <span className="product-badge">{t.foundAccess}</span>
                </div>
                <div className="product-copy">
                  <div>
                    <h3>{product.name}</h3>
                    <p>{product.line[lang]}</p>
                  </div>
                  <dl>
                    <div>
                      <dt>{t.designer}</dt>
                      <dd>{product.designer}</dd>
                    </div>
                    <div>
                      <dt>{t.sizes}</dt>
                      <dd>34 EUR</dd>
                    </div>
                  </dl>
                  <button onClick={() => showView("play")}>{t.playToGet}</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {view === "play" && (
        <section className="screen-section play-screen">
          <div className="drops-copy">
            <h2>{t.gameTitle}</h2>
            <span>{t.gameText}</span>
            <small>{t.gameHint}</small>
          </div>
          <AsteroidsGame onUnlock={unlockDrop} />
        </section>
      )}

      {view === "about" && (
        <section className="screen-section about-screen">
          <div>
            <p>03</p>
            <h2>{t.aboutTitle}</h2>
          </div>
          <p>{t.aboutText}</p>
        </section>
      )}

      {view === "contact" && (
        <section className="screen-section contact-screen">
          <div>
            <p>04</p>
            <h2>{t.contactTitle}</h2>
            <span>{t.contactText}</span>
          </div>
          <div className="contact-list">
            <a href={`mailto:${t.email}`}>{t.email}</a>
            <a href="https://www.instagram.com/asteroidssupply/" target="_blank" rel="noreferrer">
              {t.instagram}
            </a>
          </div>
        </section>
      )}

      {view === "legal" && (
        <section className="screen-section legal-screen">
          <div>
            <p>Legal</p>
            <h2>{t.legalTitle}</h2>
            <span>{t.legalText}</span>
          </div>
          <address className="legal-copy">
            <strong>{t.legalCompany}</strong>
            <span>{t.legalAddress}</span>
            <span>{t.legalNif}</span>
          </address>
        </section>
      )}

      <aside className={`cart-drawer ${cartOpen ? "open" : ""}`} aria-label="Shopping cart">
        <div className="cart-head">
          <h2>{t.cart}</h2>
          <button onClick={() => setCartOpen(false)} aria-label="Close cart">
            x
          </button>
        </div>
        {cartItems.length === 0 ? (
          <p className="empty-cart">{t.empty}</p>
        ) : (
          <>
            <div className="cart-list">
              {cartItems.map((item) => (
                <div className="cart-line" key={item.id}>
                  <img src={item.mockupImage ?? item.gallery?.[0]?.src ?? item.image} alt={`${item.name} shirt`} />
                  <div>
                    <span>{item.name}</span>
                    <small>
                      {item.qty} x {item.price} EUR
                    </small>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-actions">
              <div className="cart-total">
                <span>{t.subtotal}</span>
                <strong>{total} EUR</strong>
              </div>
              <button className="checkout-button">{t.checkout}</button>
              <button className="clear-button" onClick={() => setCart({})}>
                {t.clear}
              </button>
            </div>
          </>
        )}
      </aside>
      {cartOpen && <button className="cart-scrim" onClick={() => setCartOpen(false)} aria-label="Close cart" />}
    </main>
  );
}
