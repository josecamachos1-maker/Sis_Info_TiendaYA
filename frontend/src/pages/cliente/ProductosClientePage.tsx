import "../../styles/cliente/ProductosClientePage.css";
import { NavbarCliente } from "../../components/cliente/NavbarCliente";
import { ProductoCard } from "../../components/cliente/ProductoCard";
import { Logo } from "../../components/logo";
import { SearchBar } from "../../components/cliente/SearchBar";
import { useState, useEffect } from "react";
import { CategoriaTabs } from "../../components/cliente/CategoriaTabs";
import { PaginaActualC } from "../../components/cliente/PaginaActualC";

type ProductoBackend = {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  disponible: boolean;
};

type Props = {
  onNavigate: (pagina: string) => void;
  carrito: Array<{ id: number; cantidad: number }>;
  onActualizarCantidad: (id: number, cambio: number) => void;
};

export function ProductosClientePage({ onNavigate, carrito = [], onActualizarCantidad }: Props) {
  const [busqueda, setBusqueda] = useState("");
  const [productos, setProductos] = useState<ProductoBackend[]>([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const obtenerCatalogoCompleto = async () => {
      try {
        setCargando(true);
        const res = await fetch("http://localhost:3000/v1/productos");
        const data = await res.json();
        const productosMapeados = data.map((p: any) => ({
          id: p.id,
          nombre: p.nombre,
          precio: p.precio,
          imagen: p.imageUrl || "/decor/producto-default.jpg",
          disponible: p.stock > 0
        }));
        setProductos(productosMapeados);
      } catch (error) {
        console.error("Error al conectar con la API de catálogo completo:", error);
        setProductos([]);
      } finally {
        setCargando(false);
      }
    };

    obtenerCatalogoCompleto();
  }, []);

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const carritoSeguro = carrito || [];

  return (
    <main className="productos-cliente-page">
      <header className="cliente-header">
        <Logo width="260px" />
      </header>

      <PaginaActualC titulo="Productos" />

      <SearchBar busqueda={busqueda} setBusqueda={setBusqueda} />
      <CategoriaTabs />

      <section className="productos-grid">
        {cargando ? (
          <p>Cargando productos...</p>
        ) : (
          productosFiltrados.map((producto) => {
            const enCarrito = carritoSeguro.find((item) => item.id === producto.id);
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
                mostrarDisponibilidad={true} 
                variante="vertical"
                onAumentar={() => onActualizarCantidad(producto.id, 1)}
                onDisminuir={() => onActualizarCantidad(producto.id, -1)}
              />
            );
          })
        )}
      </section>

      <NavbarCliente paginaActiva="productos" onNavigate={onNavigate} />
    </main>
  );
}