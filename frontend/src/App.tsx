import { useState } from "react";

import "./styles/global.css";
import "./styles/role-selection.css";
import "./styles/login.css";
import "./styles/dashboard-cajero.css";
import "./styles/buscar-producto.css";
import "./styles/nueva-venta.css";
import "./styles/registrar-pedido.css";
import "./styles/pedidos-pendientes.css";
import "./styles/clientes.css";
import "./styles/cierre-de-caja.css";
import "./styles/reportes.css";

import { DashboardRepartidorPage } from "./pages/repartidor/DashboardRepartidorPage";
import { PedidosRepartidorPage } from "./pages/repartidor/PedidosRepartidorPage";
import { HistorialRepartidorPage } from "./pages/repartidor/HistorialRepartidorPage";
import "./styles/dashboard-repartidor.css";
import "./styles/estilos_repartidor/pedidos.css";
import "./styles/estilos_repartidor/historial.css";

import { RoleSelectionPage } from "./pages/RoleSelectionPage";
import { LoginPage } from "./pages/LoginPage";

import { DashboardCajeroPage } from "./pages/cajero/DashboardCajeroPage";
import { NuevaVentaPage } from "./pages/cajero/NuevaVentaPage";
import { RegistrarPedidoPage } from "./pages/cajero/RegistrarPedidoPage";
import { BuscarProductoPage } from "./pages/cajero/BuscarProductoPage";
import { PedidosPendientesPage } from "./pages/cajero/PedidosPendientesPage";
import { ClientesPage } from "./pages/cajero/ClientesPage";
import { CierreDeCajaPage } from "./pages/cajero/CierreDeCajaPage";
import { ReportesPage } from "./pages/cajero/ReportesPage";

import type { VistaCajero } from "./types/navigation";

export type RolUsuario = "CLIENTE" | "CAJERO" | "REPARTIDOR" | "ADMINISTRADOR";

export type UsuarioLogueado = {
  id: number;
  nombre: string;
  email: string;
  rol: string;
};

type VistaRepartidor = "dashboard" | "pedidos" | "historial";

function App() {
  const [rolSeleccionado, setRolSeleccionado] = useState<RolUsuario | null>(null);
  const [usuarioLogueado, setUsuarioLogueado] = useState<UsuarioLogueado | null>(null);
  const [vistaCajero, setVistaCajero] = useState<VistaCajero>("dashboard");
  const [vistaRepartidor, setVistaRepartidor] = useState<VistaRepartidor>("dashboard");

  function cambiarVistaRepartidor(vista: string) {
  if (vista === "dashboard" || vista === "pedidos" || vista === "historial") {
    setVistaRepartidor(vista);
  }
}

  function cerrarSesion() {
    setUsuarioLogueado(null);
    setRolSeleccionado(null);
    setVistaCajero("dashboard");
    setVistaRepartidor("dashboard");
  }

  if (usuarioLogueado?.rol === "REPARTIDOR") {
    if (vistaRepartidor === "pedidos") {
      return (
        <PedidosRepartidorPage
  usuario={usuarioLogueado}
  cambiarVista={cambiarVistaRepartidor}
  onLogout={cerrarSesion}
/>
      );
    }

    if (vistaRepartidor === "historial") {
      return (
       <HistorialRepartidorPage
  usuario={usuarioLogueado}
  cambiarVista={cambiarVistaRepartidor}
  onLogout={cerrarSesion}
/>
      );
    }

    return (
      <DashboardRepartidorPage
  usuario={usuarioLogueado}
  cambiarVista={cambiarVistaRepartidor}
  onLogout={cerrarSesion}
/>
    );
  }


  

  if (usuarioLogueado?.rol === "CAJERO") {
    if (vistaCajero === "nueva-venta") {
      return (
        <NuevaVentaPage
          usuario={usuarioLogueado}
          onNavigate={setVistaCajero}
          onLogout={cerrarSesion}
        />
      );
    }

    if (vistaCajero === "registrar-pedido") {
      return (
        <RegistrarPedidoPage
          usuario={usuarioLogueado}
          onNavigate={setVistaCajero}
          onLogout={cerrarSesion}
        />
      );
    }

    if (vistaCajero === "pedidos-pendientes") {
      return (
        <PedidosPendientesPage
          usuario={usuarioLogueado}
          onNavigate={setVistaCajero}
          onLogout={cerrarSesion}
        />
      );
    }

    if (vistaCajero === "buscar-producto") {
      return (
        <BuscarProductoPage
          usuario={usuarioLogueado}
          onNavigate={setVistaCajero}
          onLogout={cerrarSesion}
        />
      );
    }

    if (vistaCajero === "clientes") {
      return (
        <ClientesPage
          usuario={usuarioLogueado}
          onNavigate={setVistaCajero}
          onLogout={cerrarSesion}
        />
      );
    }

    if (vistaCajero === "cierre-caja") {
      return (
        <CierreDeCajaPage
          usuario={usuarioLogueado}
          onNavigate={setVistaCajero}
          onLogout={cerrarSesion}
        />
      );
    }

    if (vistaCajero === "reportes") {
      return (
        <ReportesPage
          usuario={usuarioLogueado}
          onNavigate={setVistaCajero}
          onLogout={cerrarSesion}
        />
      );
    }

    return (
      <DashboardCajeroPage
        usuario={usuarioLogueado}
        onNavigate={setVistaCajero}
        onLogout={cerrarSesion}
      />
    );
  }

  if (rolSeleccionado === null) {
    return <RoleSelectionPage onSeleccionarRol={setRolSeleccionado} />;
  }

  return (
    <LoginPage
      rol={rolSeleccionado}
      onVolver={() => setRolSeleccionado(null)}
      onLoginCorrecto={setUsuarioLogueado}
    />
  );
}
export default App;
