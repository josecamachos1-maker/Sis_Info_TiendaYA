import "../../styles/cliente/carrito-cliente.css";
import { useState } from "react";
import { Logo } from "../../components/logo";  
import { NavbarCliente } from "../../components/cliente/NavbarCliente";
import { PaginaActualC } from "../../components/cliente/PaginaActualC";
import { SearchBar } from "../../components/cliente/SearchBar";
import { ProductoCard } from "../../components/cliente/ProductoCard";
import { CarritoItem } from "../../components/cliente/CarritoItem";

type ItemCarrito = {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
};

type Props = {
  onNavigate: (pagina: string) => void;
  // Pasamos una función para guardar temporalmente el método de pago elegido o el total en un estado global si se requiere
  setMetodoPagoGlobal?: (metodo: string) => void; 
};

export function CarritoClientePage({ onNavigate }: Props) {
  const [busqueda, setBusqueda] = useState("");
  const [metodoPago, setMetodoPago] = useState("");

  const [productosExtra] = useState<ItemCarrito[]>([
    { id: 1, nombre: "Sprite 2lts", precio: 20, cantidad: 0, imagen: "/decor/sprite.jpg" },
    { id: 2, nombre: "Chocolate BAURE", precio: 32, cantidad: 0, imagen: "/decor/baure.jpg" },
    { id: 5, nombre: "Pringles", precio: 32, cantidad: 0, imagen: "/decor/pringles.jpg" }
  ]);

  const [productosEnCarrito, setProductosEnCarrito] = useState<ItemCarrito[]>([
    { id: 3, nombre: "OREO", precio: 8, cantidad: 4, imagen: "/decor/oreo.jpg" },
    { id: 4, nombre: "MONSTER WHITE", precio: 20, cantidad: 1, imagen: "/decor/monster.jpg" },
    { id: 6, nombre: "COCA COLA 300ml", precio: 4, cantidad: 2, imagen: "/decor/coca.jpg" }
  ]);

  function añadirDesdeSugeridos(id: number) {
    const productoSugerido = productosExtra.find(p => p.id === id);
    if (!productoSugerido) return;

    setProductosEnCarrito((prev) => {
      const existe = prev.find(p => p.id === id);
      if (existe) {
        return prev.map(p => p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p);
      }
      return [...prev, { ...productoSugerido, cantidad: 1 }];
    });
  }

  function aumentarCantidad(id: number) {
    setProductosEnCarrito((prev) =>
      prev.map((p) => p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p)
    );
  }

  function disminuirCantidad(id: number) {
    setProductosEnCarrito((prev) =>
      prev.map((p) => p.id === id ? { ...p, cantidad: p.cantidad > 1 ? p.cantidad - 1 : 1 } : p)
    );
  }

  function eliminarProducto(id: number) {
    setProductosEnCarrito((prev) => prev.filter((p) => p.id !== id));
  }

  const productosEnCarritoFiltrados = productosEnCarrito.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const total = productosEnCarrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  const irAlFormularioCheckout = () => {
    if (!metodoPago) return;
    onNavigate("checkout");
  };

  return (
    <main className="carrito-cliente-page">
      <header className="cliente-header">
        <Logo width="260px" />
      </header>

      <PaginaActualC titulo="Carrito" />
      <SearchBar busqueda={busqueda} setBusqueda={setBusqueda} />
      
      <p><span style={{ color: "#5f6164f7" }}>Combina tu orden con:</span></p>

      <section className="productos-extra" style={{ display: "flex", overflowX: "auto", gap: "10px", paddingBottom: "10px" }}>
        {productosExtra.map((producto) => (
          <ProductoCard 
            key={producto.id}
            id={producto.id}
            nombre={producto.nombre}
            precio={producto.precio}
            imagen={producto.imagen}
            variante="horizontal"
            disponible={true}
            onAumentar={() => añadirDesdeSugeridos(producto.id)}
          />
        ))}
      </section>

      <strong><span style={{ color: "#0a0a0a" }}>Tu Carrito:</span></strong>
      {productosEnCarrito.length === 0 && <p>Tu carrito está vacío</p>}

      <section className="productos-carrito">
        {productosEnCarritoFiltrados.map((producto) => (
          <CarritoItem
            key={producto.id}
            nombre={producto.nombre}
            precio={producto.precio} 
            cantidad={producto.cantidad}
            imagen={producto.imagen}
            onAumentar={() => aumentarCantidad(producto.id)}
            onDisminuir={() => disminuirCantidad(producto.id)}
            onEliminar={() => eliminarProducto(producto.id)}
          />
        ))}
      </section>    

      <strong style={{ display: "block", marginTop: "15px" }}>TOTAL: {total} bs</strong>
      <p><span style={{ color: "#787474ec", fontWeight: "lighter" }}>*no incluye envio</span></p>
      
      <p>Elija el metodo de pago antes del checkout:</p>
      
      <div className="metodos-pago">
        <label className="metodo-item">
          <input type="radio" name="metodoPago" value="EFECTIVO" checked={metodoPago === "EFECTIVO"} onChange={(e) => setMetodoPago(e.target.value)} />
          <span>Efectivo</span>
        </label>
        <label className="metodo-item">
          <input type="radio" name="metodoPago" value="QR" checked={metodoPago === "QR"} onChange={(e) => setMetodoPago(e.target.value)} />
          <span>QR</span>
        </label>
        <label className="metodo-item">
          <input type="radio" name="metodoPago" value="TARJETA" checked={metodoPago === "TARJETA"} onChange={(e) => setMetodoPago(e.target.value)} />
          <span>Tarjeta</span>
        </label>
      </div>
      
      <div className="checkout" style={{ marginTop: "20px" }}>
        <button 
          className="btn-checkout"
          disabled={!metodoPago}
          onClick={irAlFormularioCheckout}
        >
          Checkout
        </button>
      </div>

      <NavbarCliente paginaActiva="carrito" onNavigate={onNavigate} />
    </main> 
  ); 
}