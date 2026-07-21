"use client";

import { useMemo, useState } from "react";

type Lang = "en" | "es";

type Product = {
  id: string;
  name: string;
  designer: string;
  price: number;
  mode: "buy" | "drop";
  image?: string;
  palette: string;
  line: Record<Lang, string>;
};

type CartItem = Product & { qty: number };

const copy = {
  en: {
    navShop: "Shop",
    navDrops: "Play for Drops",
    navAbout: "About",
    cart: "Cart",
    heroKicker: "Organic cotton garments from a desert that denies everything.",
    heroTitle: "Asteroids Supply",
    heroBody:
      "A fashion brand with alien models, invented words and the quiet confidence of someone badly pretending to be human.",
    shopNow: "Shop available words",
    playDrops: "Enter the back room",
    capsule: "First transmission",
    capsuleText:
      "Six pieces are available now. Three only appear after the right asteroid is destroyed. Replenishment exists. Dignity is not guaranteed.",
    available: "Available",
    hidden: "Drop",
    add: "Add to cart",
    locked: "Unlock in game",
    designer: "Designer",
    material: "Organic cotton, made on demand through La Tostadora.",
    gameTitle: "Play for Drops",
    gameText:
      "Destroy the asteroids carrying words. If the word survives your taste, it enters the cart automatically.",
    gameHint: "Click word asteroids to unlock Driftique, Moonjuice or Doomsnack.",
    aboutTitle: "About",
    aboutText:
      "Asteroids Supply makes T-shirts from words that should not exist and aliens who behave as if premium fashion were a perfectly normal human ritual.",
    empty: "The cart is elegantly empty.",
    subtotal: "Subtotal",
    checkout: "Checkout soon",
    clear: "Clear",
    sizes: "Sizes S-XXL",
    bilingual: "EN / ES",
  },
  es: {
    navShop: "Tienda",
    navDrops: "Play for Drops",
    navAbout: "About",
    cart: "Cesta",
    heroKicker: "Camisetas de algodón orgánico desde un desierto que lo niega todo.",
    heroTitle: "Asteroids Supply",
    heroBody:
      "Una marca de moda con modelos alienígenas, palabras inventadas y la discreta seguridad de alguien imitando mal a un humano.",
    shopNow: "Comprar palabras",
    playDrops: "Entrar a la trastienda",
    capsule: "Primera transmisión",
    capsuleText:
      "Seis piezas están disponibles. Tres aparecen solo cuando destruyes el asteroide correcto. Hay reposición. La dignidad no está incluida.",
    available: "Disponible",
    hidden: "Drop",
    add: "Añadir a la cesta",
    locked: "Desbloquear jugando",
    designer: "Diseñador",
    material: "Algodón orgánico, producido bajo demanda con La Tostadora.",
    gameTitle: "Play for Drops",
    gameText:
      "Destruye los asteroides que llevan palabras. Si la palabra sobrevive a tu criterio, entra automáticamente en la cesta.",
    gameHint: "Haz click en los asteroides con palabra para desbloquear Driftique, Moonjuice o Doomsnack.",
    aboutTitle: "About",
    aboutText:
      "Asteroids Supply hace camisetas a partir de palabras que no deberian existir y aliens que actuan como si la moda premium fuese un ritual humano perfectamente normal.",
    empty: "La cesta está elegantemente vacía.",
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
    designer: "Alvaro",
    price: 42,
    mode: "buy",
    palette: "sun",
    line: {
      en: "For people who have made peace with the glare.",
      es: "Para gente que ha hecho las paces con el resplandor.",
    },
  },
  {
    id: "duskpop",
    name: "Duskpop",
    designer: "To be confirmed",
    price: 42,
    mode: "buy",
    palette: "dusk",
    line: {
      en: "A small collapse of color at the end of the day.",
      es: "Un pequeño colapso de color al final del día.",
    },
  },
  {
    id: "daymelt",
    name: "Daymelt",
    designer: "Marco Rollo",
    price: 42,
    mode: "buy",
    image: "/assets/daymelt.png",
    palette: "day",
    line: {
      en: "The afternoon has softened. So have your standards.",
      es: "La tarde se ha ablandado. Tus estándares también.",
    },
  },
  {
    id: "soulspill",
    name: "Soulspill",
    designer: "Basora",
    price: 42,
    mode: "buy",
    image: "/assets/soulspill.png",
    palette: "soul",
    line: {
      en: "Emotional leakage, tastefully contained.",
      es: "Fuga emocional, contenida con bastante gusto.",
    },
  },
  {
    id: "karmaggedon",
    name: "Karmaggedon",
    designer: "Teo",
    price: 42,
    mode: "buy",
    image: "/assets/karmaggedon.png",
    palette: "karma",
    line: {
      en: "Consequences, but with better kerning.",
      es: "Consecuencias, pero con mejor kerning.",
    },
  },
  {
    id: "motelism",
    name: "Motelism",
    designer: "Victor Lavega",
    price: 42,
    mode: "buy",
    image: "/assets/motelism.png",
    palette: "motel",
    line: {
      en: "The philosophy of leaving before breakfast.",
      es: "La filosofía de irse antes del desayuno.",
    },
  },
  {
    id: "driftique",
    name: "Driftique",
    designer: "Isabelita",
    price: 42,
    mode: "drop",
    image: "/assets/driftique.png",
    palette: "drift",
    line: {
      en: "Available only after a small act of aim.",
      es: "Disponible solo tras un pequeño acto de puntería.",
    },
  },
  {
    id: "moonjuice",
    name: "Moonjuice",
    designer: "DAQ",
    price: 42,
    mode: "drop",
    image: "/assets/moonjuice.png",
    palette: "moon",
    line: {
      en: "Hydration for bodies with no disclosed origin.",
      es: "Hidratación para cuerpos de origen no declarado.",
    },
  },
  {
    id: "doomsnack",
    name: "Doomsnack",
    designer: "Wete",
    price: 42,
    mode: "drop",
    image: "/assets/doomsnack.png",
    palette: "doom",
    line: {
      en: "A final bite, calmly styled.",
      es: "Un último bocado, tranquilamente estilizado.",
    },
  },
];

const asteroidMap = [
  { id: "dust-1", label: "", x: 10, y: 20, size: 74 },
  { id: "driftique", label: "Driftique", x: 22, y: 58, size: 112 },
  { id: "dust-2", label: "", x: 39, y: 30, size: 62 },
  { id: "moonjuice", label: "Moonjuice", x: 55, y: 64, size: 128 },
  { id: "dust-3", label: "", x: 72, y: 24, size: 86 },
  { id: "doomsnack", label: "Doomsnack", x: 82, y: 55, size: 116 },
];

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [destroyed, setDestroyed] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const t = copy[lang];

  const cartItems = useMemo(() => Object.values(cart), [cart]);
  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const addToCart = (product: Product) => {
    setCart((current) => ({
      ...current,
      [product.id]: {
        ...product,
        qty: (current[product.id]?.qty ?? 0) + 1,
      },
    }));
    setCartOpen(true);
  };

  const destroyAsteroid = (id: string) => {
    if (destroyed.includes(id)) return;
    setDestroyed((current) => [...current, id]);
    const product = products.find((item) => item.id === id);
    if (product) addToCart(product);
  };

  return (
    <main>
      <header className="site-header">
        <a className="brand-mark" href="#top" aria-label="Asteroids Supply home">
          AS
        </a>
        <nav aria-label="Primary navigation">
          <a href="#shop">{t.navShop}</a>
          <a href="#drops">{t.navDrops}</a>
          <a href="#about">{t.navAbout}</a>
        </nav>
        <div className="header-actions">
          <button className="lang-switch" onClick={() => setLang(lang === "en" ? "es" : "en")}>
            {t.bilingual}
          </button>
          <button className="cart-button" onClick={() => setCartOpen(true)}>
            {t.cart} <span>{cartItems.reduce((sum, item) => sum + item.qty, 0)}</span>
          </button>
        </div>
      </header>

      <section className="hero" id="top">
        <img src="/assets/hero-arcade.jpeg" alt="Alien model wearing Asteroids Supply in an arcade" />
        <div className="hero-overlay" />
        <div className="hero-copy">
          <p>{t.heroKicker}</p>
          <h1>{t.heroTitle}</h1>
          <span>{t.heroBody}</span>
          <div className="hero-actions">
            <a href="#shop">{t.shopNow}</a>
            <a href="#drops">{t.playDrops}</a>
          </div>
        </div>
      </section>

      <section className="intro-band" aria-label="Collection premise">
        <div>
          <p>{t.capsule}</p>
          <h2>{t.capsuleText}</h2>
        </div>
        <span>{t.material}</span>
      </section>

      <section className="shop-section" id="shop">
        <div className="section-heading">
          <p>01</p>
          <h2>Available words</h2>
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <article className={`product-card ${product.palette}`} key={product.id}>
              <div className="product-image">
                {product.image ? (
                  <img src={product.image} alt={`${product.name} T-shirt worn by an alien model`} />
                ) : (
                  <div className="word-plate">
                    <span>{product.name}</span>
                  </div>
                )}
                <span className="product-badge">{product.mode === "buy" ? t.available : t.hidden}</span>
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
                    <dd>42 EUR</dd>
                  </div>
                </dl>
                <button
                  onClick={() => product.mode === "buy" && addToCart(product)}
                  disabled={product.mode === "drop"}
                >
                  {product.mode === "buy" ? t.add : t.locked}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="drops-section" id="drops">
        <div className="drops-copy">
          <p>02</p>
          <h2>{t.gameTitle}</h2>
          <span>{t.gameText}</span>
          <small>{t.gameHint}</small>
        </div>
        <div className="asteroid-room" aria-label="Asteroid drop game">
          <div className="ship" aria-hidden="true" />
          {asteroidMap.map((asteroid) => (
            <button
              className={`asteroid ${destroyed.includes(asteroid.id) ? "destroyed" : ""} ${
                asteroid.label ? "word-asteroid" : ""
              }`}
              key={asteroid.id}
              style={{
                left: `${asteroid.x}%`,
                top: `${asteroid.y}%`,
                width: asteroid.size,
                height: asteroid.size,
              }}
              onClick={() => destroyAsteroid(asteroid.id)}
              aria-label={asteroid.label ? `Destroy ${asteroid.label}` : "Destroy asteroid"}
            >
              <span>{asteroid.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="about-section" id="about">
        <div>
          <p>03</p>
          <h2>{t.aboutTitle}</h2>
        </div>
        <p>{t.aboutText}</p>
      </section>

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
                  <span>{item.name}</span>
                  <small>
                    {item.qty} x {item.price} EUR
                  </small>
                </div>
              ))}
            </div>
            <div className="cart-total">
              <span>{t.subtotal}</span>
              <strong>{total} EUR</strong>
            </div>
            <button className="checkout-button">{t.checkout}</button>
            <button className="clear-button" onClick={() => setCart({})}>
              {t.clear}
            </button>
          </>
        )}
      </aside>
      {cartOpen && <button className="cart-scrim" onClick={() => setCartOpen(false)} aria-label="Close cart" />}
    </main>
  );
}
