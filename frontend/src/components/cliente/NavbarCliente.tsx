import "../../styles/cliente/navbar-cliente.css";

import{
    Home,
    ShoppingBag,
    ShoppingCart,
    ClipboardList,
    User,
} from "lucide-react";

export function NavbarCliente() {
    return(
    <nav className="navbar-cliente">
      <button>
        <Home size={22} />
        <span>Home</span>
      </button>
      <button>
        <ShoppingBag size={22} />
        <span>Productos</span>
      </button>
      <button>
        <ShoppingCart size={22} />
        <span>Carrito</span>
      </button>
      <button>
        <ClipboardList size={22} />
        <span>Mis pedidos</span>
      </button>
      <button>
        <User size={22} />
        <span>Perfil</span>
      </button>
    </nav>
  );
}