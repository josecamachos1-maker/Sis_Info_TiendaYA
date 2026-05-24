import "../../styles/cliente/ProductosClientePage.css";
import { NavbarCliente } from "../../components/cliente/NavbarCliente";
import { ProductoCard } from "../../components/cliente/ProductoCard";
import { Logo } from "../../components/logo";
import {SearchBar} from "../../components/cliente/SearchBar";
import { useState } from "react";
import { CategoriaTabs } from "../../components/cliente/CategoriaTabs";
import { PaginaActualC } from "../../components/cliente/PaginaActualC";


export function ProductosClientePage() {
   const [busqueda, setBusqueda] = useState("");
   const productos = [
    {
      nombre: "Coca Cola",
      precio: 15,
      imagen: "/decor/coca.jpg",
    },

    {
      nombre: "Pringles",
      precio: 18,
      imagen: "/decor/pringles.jpg",
      disponible: true,
    },

    {
      nombre: "Sprite",
      precio: 12,
      imagen: "/decor/sprite.jpg",
      disponible: false,
    },
  ];
   const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );
   return(
    <main className="productos-cliente-page">

      <header className="cliente-header">
        <Logo width="260px" />
      </header>
    
      <PaginaActualC titulo="Productos" />

     <SearchBar
     busqueda={busqueda}
     setBusqueda={setBusqueda}
     />  
     <CategoriaTabs/> 

     <section className="productos-grid">

        {productosFiltrados.map((producto) => (
          <ProductoCard
            key={producto.nombre}
            nombre={producto.nombre}
            precio={producto.precio}
            imagen={producto.imagen}
            disponible={producto.disponible}
            mostrarDisponibilidad={true}
     />
    ))}

      </section>
     <NavbarCliente paginaActiva="productos" />
    </main>   
   );
}