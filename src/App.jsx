import { useState, useEffect } from "react";
import { T } from "./locales/index.js";
import { initCats, initProducts, initGallery } from "./data/initialData.js";
import { useLS } from "./hooks/useLocalStorage.js";
import { ORDER_PHONE, ADMIN_PATH } from "./config.js";
import CartDrawer from "./components/CartDrawer.jsx";
import Shop from "./pages/Shop.jsx";
import { About, Delivery, Contacts } from "./pages/Info.jsx";
import Admin from "./admin/Admin.jsx";
import { Moon, Sun, Cart, Gear } from "./components/Icons.jsx";

export default function App() {
  const [lang, setLang] = useLS("lang", "ru");
  const [theme, setTheme] = useLS("theme", "light");
  const [route, setRoute] = useState(
    window.location.hash === ADMIN_PATH ? "admin" : "home",
  );
  const [side, setSide] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useLS("cart3", {});
  const [msg, setMsg] = useState("");
  const [products, setProducts] = useLS("products3", initProducts);
  const [cats, setCats] = useLS("cats2", initCats);
  const [orders, setOrders] = useLS("orders", []);
  const [users, setUsers] = useLS("users", []);
  const [auth, setAuth] = useLS("auth", false);
  const [gallery, setGallery] = useLS("gallery", initGallery);
  const [settings, setSettings] = useLS("settings", {
    shop: "Sweet Cakes",
    phone: ORDER_PHONE,
    address: "Tashkent",
    hours: "09:00 – 21:00",
  });
  const t = T[lang];
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = lang;
  }, [theme, lang]);
  useEffect(() => {
    const h = () => window.location.hash === ADMIN_PATH && setRoute("admin");
    window.addEventListener("hashchange", h);
    return () => window.removeEventListener("hashchange", h);
  }, []);
  const toast = (m) => {
    setMsg(m);
    setTimeout(() => setMsg(""), 3000);
  };
  const goto = (r) => {
    setRoute(r);
    setSide(false);
    window.scrollTo(0, 0);
  };
  const go = (k) => {
    if (k === "menu") {
      goto("home");
      setTimeout(
        () =>
          document
            .getElementById("menu")
            ?.scrollIntoView({ behavior: "smooth" }),
        80,
      );
    } else goto(k);
  };
  const count = Object.values(cart).reduce(
    (a, b) => a + (typeof b === "number" ? b : 0),
    0,
  );
  const nav = [
    ["home", t.home],
    ["menu", t.menu],
    ["about", t.about],
    ["delivery", t.delivery],
    ["contacts", t.contacts],
  ];
  const db = {
    gallery,
    setGallery,
    settings,
    setSettings,
    products,
    setProducts,
    cats,
    setCats,
    orders,
    setOrders,
    users,
    setUsers,
  };
  return (
    <>
      <header className="top">
        <button
          className="icon burger"
          onClick={() => setSide(!side)}
          aria-label="menu"
        >
          ☰
        </button>
        <div className="logo" onClick={() => goto("home")}>
          {settings.logo && (
            <img className="logoimg" src={settings.logo} alt="" />
          )}
          {settings.shop}
        </div>
        <nav className="tnav">
          {nav.map(([k, l]) => (
            <button
              key={k}
              className={route === k ? "on" : ""}
              onClick={() => go(k)}
            >
              {l}
            </button>
          ))}
        </nav>
        <div className="grow" />
        {auth && (
          <button className="btn sm adminbtn" onClick={() => goto("admin")}>
            <Gear /> {t.adminBtn}
          </button>
        )}
        <select
          className="lang"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
        >
          <option value="ru">RU</option>
          <option value="uz">UZ</option>
          <option value="en">EN</option>
        </select>
        <button
          className="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          aria-label="theme"
        >
          {theme === "light" ? <Moon /> : <Sun />}
        </button>
        <button
          className="icon cartbtn"
          onClick={() => setCartOpen(true)}
          aria-label="cart"
        >
          <Cart />
          {count > 0 && <em>{count}</em>}
        </button>
      </header>
      <div
        className={"shade" + (side || cartOpen ? " on" : "")}
        onClick={() => {
          setSide(false);
          setCartOpen(false);
        }}
      />
      <aside className={"menu" + (side ? " open" : "")}>
        {nav.map(([k, l]) => (
          <button key={k} onClick={() => go(k)}>
            {l}
          </button>
        ))}
        {auth && <button onClick={() => goto("admin")}>{t.admin}</button>}
      </aside>
      <main>
        {route === "admin" ? (
          <Admin t={t} db={db} goto={goto} auth={auth} setAuth={setAuth} />
        ) : route === "about" ? (
          <About t={t} />
        ) : route === "delivery" ? (
          <Delivery t={t} />
        ) : route === "contacts" ? (
          <Contacts t={t} s={settings} />
        ) : (
          <Shop
            t={t}
            products={products}
            cats={cats}
            setCart={setCart}
            s={settings}
            gallery={gallery}
          />
        )}
      </main>
      <footer>
        <b>{settings.shop}</b>
        <span>
          {settings.address} · {settings.hours}
        </span>
        <a href={`tel:+${settings.phone}`}>+{settings.phone}</a>
      </footer>
      <CartDrawer
        t={t}
        phone={settings.phone}
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        products={products}
        cart={cart}
        setCart={setCart}
        orders={orders}
        setOrders={setOrders}
        users={users}
        setUsers={setUsers}
        toast={toast}
      />
      {msg && <div className="toast">{msg}</div>}
    </>
  );
}
