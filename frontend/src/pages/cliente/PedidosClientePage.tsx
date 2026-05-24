import "../../styles/cliente/pedidos-cliente.css";
import { useState } from "react";
import { NavbarCliente } from "../../components/cliente/NavbarCliente";
import { Logo } from "../../components/logo";
import { PaginaActualC } from "../../components/cliente/PaginaActualC";
import { PedidoCard } from "../../components/cliente/PedidoCard";

import type { Pedido } from "../../types/pedido";

export function PedidosClientePage() {
 const [filtro, setFiltro] = useState("TODOS");
  const pedidos: Pedido[] = [

    {
      id: 1,
      fecha: "2024-06-01",
      total: 45,
      estado: "PENDIENTE",
      tipoEntrega: "ENVIO",
    },

    {
      id: 2,
      fecha: "2024-05-28",
      total: 30,
      estado: "LISTO_RECOJO",
      tipoEntrega: "RECOJO",
    },

    {
      id: 3,
      fecha: "2024-05-20",
      total: 60,
      estado: "ENTREGADO",
      tipoEntrega: "ENVIO",
    },

  ];
     const pedidosFiltrados = pedidos.filter((pedido) => {
  
    if (filtro === "TODOS") {
      return true;
    }
  
    if (filtro === "ENVIO") {
      return pedido.tipoEntrega === "ENVIO";
    }
  
    if (filtro === "RECOJO") {
      return pedido.tipoEntrega === "RECOJO";
    }
  
    if (filtro === "CANCELADOS") {
      return pedido.estado === "CANCELADO";
    }
  
    return true;
   }  );
    return (
  
    <main className="pedidos-cliente">

      <header className="cliente-header">
        <Logo width="260px" />
      </header>

      <PaginaActualC titulo="Mis Pedidos" />

       <section className="pedidos-tabs">

  <button
    className={filtro === "TODOS" ? "activo" : ""}
    onClick={() => setFiltro("TODOS")}
  >
    Todos
  </button>

  <button
    className={filtro === "ENVIO" ? "activo" : ""}
    onClick={() => setFiltro("ENVIO")}
  >
    Envíos
  </button>

  <button
    className={filtro === "RECOJO" ? "activo" : ""}
    onClick={() => setFiltro("RECOJO")}
  >
    Recojo
  </button>

  <button
    className={filtro === "CANCELADOS" ? "activo" : ""}
    onClick={() => setFiltro("CANCELADOS")}
  >
    Cancelados
  </button>

</section>
      <section className="pedidos-lista">
        {
            pedidos.length === 0 && (
            <p>No tienes pedidos aún</p>
            )
     }
        {pedidosFiltrados.map((pedido) => (

          <PedidoCard
            key={pedido.id}
            id={pedido.id}
            fecha={pedido.fecha}
            total={pedido.total}
            estado={pedido.estado}
            tipoEntrega={pedido.tipoEntrega}
          />

        ))}

      </section>

      <NavbarCliente paginaActiva="pedidos" />

    </main>
  );
}