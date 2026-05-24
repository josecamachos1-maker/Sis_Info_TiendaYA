import "../../styles/cliente/perfil-cliente.css";

import { useState } from "react";

import {
  MapPin,
  CreditCard,
  Bell,
  Pencil,
  LogOut,
  BadgeCheck,
  UserRound,
} from "lucide-react";

import { NavbarCliente } from "../../components/cliente/NavbarCliente";
import { Logo } from "../../components/logo";
import { PaginaActualC } from "../../components/cliente/PaginaActualC";

export function PerfilClientePage() {

  const [nombre, setNombre] =
    useState("Juan");

  const [apellido, setApellido] =
    useState("Pérez");

  const [email, setEmail] =
    useState("juan@gmail.com");

  const [telefono, setTelefono] =
    useState("76543210");

  function guardarCambios() {

    alert("Información actualizada");

  }

  return (

    <main className="perfil-cliente-page">

      <header className="cliente-header">
        <Logo width="260px" />
      </header>

      <PaginaActualC titulo="Perfil" />

      {/* AVATAR */}

      <section className="perfil-avatar-seccion">

        <div className="avatar-contenedor">

          <div className="avatar-circulo">

            <UserRound size={50} />

          </div>

          <div className="avatar-check">

            <BadgeCheck size={18} />

          </div>

        </div>

        <h1 className="perfil-nombre-usuario">

          {nombre} {apellido}

        </h1>

      </section>

      {/* TARJETA INFO */}

      <section
        className="perfil-tarjeta-gris"
        onClick={guardarCambios}
      >

        <div className="tarjeta-info-contenido">

          <strong>
            Información personal
          </strong>

          <span className="tarjeta-subtexto">
            {email}
          </span>

          <span className="tarjeta-subtexto">
            +591 {telefono}
          </span>

        </div>

        <button className="btn-editar-lapiz">

          <Pencil size={18} />

        </button>

      </section>

      {/* OPCIONES */}

      <section className="perfil-menu-opciones">

        {/* DIRECCIONES */}

        <div className="opcion-item">

          <div className="opcion-izquierda">

            <MapPin size={20} />

            <span className="opcion-texto">
              Direcciones guardadas
            </span>

          </div>

          <button className="btn-editar-lapiz">

            <Pencil size={18} />

          </button>

        </div>

        {/* MÉTODOS PAGO */}

        <div className="opcion-item">

          <div className="opcion-izquierda">

            <CreditCard size={20} />

            <span className="opcion-texto">
              Métodos de pago
            </span>

          </div>

          <button className="btn-editar-lapiz">

            <Pencil size={18} />

          </button>

        </div>

        {/* NOTIFICACIONES */}

        <div className="opcion-item">

          <div className="opcion-izquierda">

            <Bell size={20} />

            <span className="opcion-texto">
              Historial de notificaciones
            </span>

          </div>

        </div>

      </section>

      {/* LOGOUT */}

      <footer className="perfil-footer-acciones">

        <button className="btn-logout">

          <LogOut size={18} />

          <span>Cerrar sesión</span>

        </button>

      </footer>

      <NavbarCliente paginaActiva="perfil" />

    </main>
  );
}