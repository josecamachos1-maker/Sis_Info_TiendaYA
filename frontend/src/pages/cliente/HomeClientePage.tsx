import "../../styles/cliente/home-cliente.css";
import { useState, useEffect } from "react";

import { PaginaActualC } from "../../components/cliente/PaginaActualC";
import { NavbarCliente } from "../../components/cliente/NavbarCliente";
import { SearchBar } from "../../components/cliente/SearchBar";
import { CategoriaTabs } from "../../components/cliente/CategoriaTabs";
import { ProductoCard } from "../../components/cliente/ProductoCard";
import { Logo } from "../../components/logo";

type ProductoBackend = {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  disponible: boolean;
};

type Props = {
  onNavigate: (pagina: string) => void;
  // Estado global del carrito compartido para mantener las cantidades reales
  carrito: Array<{ id: number; cantidad: number }>;
  onActualizarCantidad: (id: number, cambio: number) => void;
};

export function HomeClientePage({ onNavigate, carrito, onActualizarCantidad }: Props) {
  const [busqueda, setBusqueda] = useState("");
  const [productos, setProductos] = useState<ProductoBackend[]>([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    /* CONEXIÓN BACKEND (Instrucciones para el Back):
      - Reemplazar este bloque con una petición Axios o Fetch.
      - METODO: GET
      - END-POINT sugerido: /api/productos/novedades (o el catálogo general filtrado)
    */
    const obtenerCatalogoHome = async () => {
      try {
        setCargando(true);
        // const res = await fetch("URL_DEL_BACKEND_AQUI/api/productos/novedades");
        // const data = await res.json();
        // setProductos(data);
      } catch (error) {
        console.error("Error al conectar con la API de productos:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerCatalogoHome();

    // DATOS FALSOS TEMPORALES (MOCK DATA)
    setProductos([
      { id: 1, nombre: "Coca Cola", precio: 15, imagen: "/decor/coca.jpg", disponible: true },
      { id: 2, nombre: "Pringles", precio: 18, imagen: "/decor/pringles.jpg", disponible: true },
      { id: 3, nombre: "Sprite", precio: 12, imagen: "/decor/sprite.jpg", disponible: true },
    ]);
  }, []);

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <main className="home-cliente">
      <header className="cliente-header">
        <Logo width="260px" />
      </header>
      <PaginaActualC titulo="Home" />
      
      <SearchBar busqueda={busqueda} setBusqueda={setBusqueda} />
      <CategoriaTabs />

      <section className="banner-novedades">
        <div className="banner-contenido">
          <h2>¡Novedades!</h2>
          <button className="btn-banner-ver" onClick={() => onNavigate("productos")}>
            Ver
          </button>
        </div>
        <div className="banner-imagen-wrapper">
          <img src="/decor/ClienteImg/novedades.jpg" alt="Novedades" className="banner-img" />
        </div>
      </section>

      <section className="productos-grid">
        {cargando ? (
          <p>Cargando productos...</p>
        ) : (
          productosFiltrados.map((producto) => {
            // Buscamos si el producto ya está en el carrito para mandarle el número exacto
            const enCarrito = carrito.find((item) => item.id === producto.id);
            const cantidadActual = enCarrito ? enCarrito.cantidad : 0;

            return (
              <ProductoCard
                key={producto.id}
                id={producto.id}
                nombre={producto.nombre}
                precio={producto.precio}
                imagen={producto.imagen}
                disponible={producto.disponible}
                cantidad={cantidadActual}
                mostrarDisponibilidad={false} 
                variante="vertical" 
                onAumentar={() => onActualizarCantidad(producto.id, 1)}
                onDisminuir={() => onActualizarCantidad(producto.id, -1)}
              />
            );
          })
        )}
      </section>

      <NavbarCliente paginaActiva="home" onNavigate={onNavigate} />
    </main>
  );
}