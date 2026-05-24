import "../../styles/cliente/navbar-cliente.css";

import{
    Home,
    ShoppingBag,
    ShoppingCart,
    ClipboardList,
    User,
} from "lucide-react";
export function NavbarCliente({ paginaActiva }: { paginaActiva: string }) {
    return(
    <nav className="navbar-cliente">
      <button className={paginaActiva === "home" ? "active" : ""}>
        <Home size={22} />
        <span>Home</span>
      </button>
      <button className={paginaActiva === "productos" ? "active" : ""}>
        <ShoppingBag size={22} />
        <span>Productos</span>
      </button>
      <button className={paginaActiva === "carrito" ? "active" : ""}>
        <ShoppingCart size={22} />
        <span>Carrito</span>
      </button>
      <button className={paginaActiva === "pedidos" ? "active" : ""}>
        <ClipboardList size={22} />
        <span>Mis pedidos</span>
      </button>
      <button className={paginaActiva === "perfil" ? "active" : ""}>
        <User size={22} />
        <span>Perfil</span>
      </button>
    </nav>
  );
}