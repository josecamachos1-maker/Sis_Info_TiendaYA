import { useMemo, useRef, useState } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  ClipboardList,
  Search,
  PackageCheck,
  Users,
  WalletCards,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  Eye,
  MoreVertical,
  X,
  Phone,
  MapPin,
  ShoppingBag,
  Calendar,
  CreditCard,
  FileText,
  ChevronLeft,
  ChevronRight,
  Edit,
  Star,
  MessageCircle,
} from "lucide-react";
import type { UsuarioLogueado } from "../../App";
import type { VistaCajero } from "../../types/navigation";
 
type Props = {
  usuario: UsuarioLogueado;
  onNavigate: (vista: VistaCajero) => void;
};
 
type EstadoCliente = "Activo" | "Inactivo";
 
type Cliente = {
  id: number;
  nombre: string;
  telefono: string;
  nit?: string;
  ultimaCompra: string;
  estado: EstadoCliente;
  tipo: "frecuente" | "nuevo" | "normal";
  direccion?: string;
  totalCompras?: number;
  comprasRealizadas?: number;
  formaPagoPreferida?: string;
  notas?: string;
};
 
type Venta = {
  fecha: string;
  detalle: string;
  total: number;
  pago: "Efectivo" | "Tarjeta";
};
 
const CLIENTES_MOCK: Cliente[] = [
  { id: 1, nombre: "Juan Pérez", telefono: "712 34567", nit: "7250256", ultimaCompra: "20/5/2026", estado: "Activo", tipo: "frecuente", direccion: "Av. América Oeste #1234, Cochabamba", totalCompras: 2450, comprasRealizadas: 12, formaPagoPreferida: "Efectivo", notas: "Prefiere entregas en la mañana." },
  { id: 2, nombre: "María Camacho", telefono: "703 12345", nit: "6845123", ultimaCompra: "18/5/2026", estado: "Activo", tipo: "frecuente", direccion: "Calle Lanza #456, Cochabamba", totalCompras: 1890, comprasRealizadas: 8, formaPagoPreferida: "Tarjeta" },
  { id: 3, nombre: "Luis Rojas", telefono: "770 98765", ultimaCompra: "15/5/2026", estado: "Activo", tipo: "normal", direccion: "Av. Blanco Galindo km 3, Cochabamba", totalCompras: 340, comprasRealizadas: 3, formaPagoPreferida: "Efectivo" },
  { id: 4, nombre: "Sofía Andrade", telefono: "672 33445", nit: "7896541", ultimaCompra: "12/5/2026", estado: "Activo", tipo: "frecuente", direccion: "Av. Heroínas #890, Cochabamba", totalCompras: 3200, comprasRealizadas: 15, formaPagoPreferida: "Tarjeta" },
  { id: 5, nombre: "Gabriel Condori", telefono: "715 55678", ultimaCompra: "10/5/2026", estado: "Inactivo", tipo: "normal", direccion: "Calle Jordán #12, Cochabamba", totalCompras: 120, comprasRealizadas: 2, formaPagoPreferida: "Efectivo" },
  { id: 6, nombre: "Verónica Flores", telefono: "681 22331", nit: "8122334", ultimaCompra: "8/5/2026", estado: "Activo", tipo: "frecuente", direccion: "Calle Sucre #78, Cochabamba", totalCompras: 980, comprasRealizadas: 6, formaPagoPreferida: "Tarjeta" },
  { id: 7, nombre: "Carlos Mamani", telefono: "770 11223", ultimaCompra: "5/5/2026", estado: "Activo", tipo: "nuevo", direccion: "Av. Aroma #55, Cochabamba", totalCompras: 85, comprasRealizadas: 1, formaPagoPreferida: "Efectivo" },
  { id: 8, nombre: "Andrea Vega", telefono: "712 88990", nit: "5544332", ultimaCompra: "3/5/2026", estado: "Activo", tipo: "frecuente", direccion: "Calle Bolívar #200, Cochabamba", totalCompras: 4100, comprasRealizadas: 20, formaPagoPreferida: "Tarjeta" },
];
 
const HISTORIAL_MOCK: Record<number, Venta[]> = {
  1: [
    { fecha: "20/5/2026", detalle: "Venta #V-0002543", total: 180, pago: "Efectivo" },
    { fecha: "18/5/2026", detalle: "Venta #V-0002521", total: 250, pago: "Tarjeta" },
    { fecha: "15/5/2026", detalle: "Venta #V-0002487", total: 95, pago: "Efectivo" },
    { fecha: "12/5/2026", detalle: "Venta #V-0002450", total: 320, pago: "Tarjeta" },
  ],
  2: [
    { fecha: "18/5/2026", detalle: "Venta #V-0002519", total: 340, pago: "Tarjeta" },
    { fecha: "10/5/2026", detalle: "Venta #V-0002480", total: 150, pago: "Tarjeta" },
  ],
};
 
const ITEMS_POR_PAGINA = 6;
 
function formatearBolivianos(valor: number) {
  return `Bs. ${Number(valor).toLocaleString("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
 
function getIniciales(nombre: string) {
  return nombre.split(" ").slice(0, 2).map((n) => n[0]).join("");
}
 
function getColorAvatar(nombre: string) {
  const colores = [
    "#F28C00", "#3B82F6", "#10B981", "#8B5CF6",
    "#EF4444", "#06B6D4", "#F59E0B", "#6366F1",
  ];
  let hash = 0;
  for (let i = 0; i < nombre.length; i++) hash += nombre.charCodeAt(i);
  return colores[hash % colores.length];
}
 
export function ClientesPage({ usuario, onNavigate }: Props) {
  const [clientes] = useState<Cliente[]>(CLIENTES_MOCK);
  const [busqueda, setBusqueda] = useState("");
  const [filtroActivo, setFiltroActivo] = useState<"Todos" | "Frecuentes" | "Con factura" | "Nuevos">("Todos");
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(clientes[0]);
  const [pagina, setPagina] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);
 
  const ahora = new Date();
  const fechaStr = `${ahora.getDate()}/${ahora.getMonth() + 1}/${ahora.getFullYear()}`;
  const horaStr = ahora.toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" });
 
  const clientesFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    return clientes.filter((c) => {
      const matchBusqueda = !q || c.nombre.toLowerCase().includes(q) || c.telefono.includes(q) || (c.nit || "").includes(q);
      const matchFiltro =
        filtroActivo === "Todos" ||
        (filtroActivo === "Frecuentes" && c.tipo === "frecuente") ||
        (filtroActivo === "Con factura" && c.nit) ||
        (filtroActivo === "Nuevos" && c.tipo === "nuevo");
      return matchBusqueda && matchFiltro;
    });
  }, [clientes, busqueda, filtroActivo]);
 
  const totalPaginas = Math.ceil(clientesFiltrados.length / ITEMS_POR_PAGINA);
  const clientesPagina = clientesFiltrados.slice((pagina - 1) * ITEMS_POR_PAGINA, pagina * ITEMS_POR_PAGINA);
 
  const historial = clienteSeleccionado ? (HISTORIAL_MOCK[clienteSeleccionado.id] || []) : [];
 
  const totalRegistrados = clientes.length;
  const totalFrecuentes = clientes.filter((c) => c.tipo === "frecuente").length;
  const totalNuevos = clientes.filter((c) => c.tipo === "nuevo").length;
  const totalFactura = clientes.filter((c) => c.nit).length;
 
  return (
    <main className="cajero-dashboard">
      <aside className="cajero-sidebar">
        <div className="cajero-logo">
          <span className="logo-text-small">tienda</span>
          <span className="logo-text-main">Ya!</span>
        </div>
        <nav className="cajero-menu">
          <button className="menu-item" onClick={() => onNavigate("dashboard")}><LayoutDashboard size={22} /><span>Dashboard</span></button>
          <button className="menu-item" onClick={() => onNavigate("nueva-venta")}><ShoppingCart size={22} /><span>Nueva Venta</span></button>
          <button className="menu-item" onClick={() => onNavigate("registrar-pedido")}><ClipboardList size={22} /><span>Registrar Pedido</span></button>
          <button className="menu-item" onClick={() => onNavigate("buscar-producto")}><Search size={22} /><span>Buscar Producto</span></button>
          <button className="menu-item" onClick={() => onNavigate("pedidos-pendientes")}><PackageCheck size={22} /><span>Pedidos Pendientes</span></button>
          <button className="menu-item active" onClick={() => onNavigate("clientes")}><Users size={22} /><span>Clientes</span></button>
          <button className="menu-item" onClick={() => onNavigate("cierre-caja")}><WalletCards size={22} /><span>Cierre de Caja</span></button>
          <button className="menu-item" onClick={() => onNavigate("reportes")}><BarChart3 size={22} /><span>Reportes</span></button>
          <button className="menu-item" onClick={() => onNavigate("configuracion")}><Settings size={22} /><span>Configuración</span></button>
        </nav>
        <div className="sidebar-user">
          <div className="sidebar-user-icon"><Users size={22} /></div>
          <div><strong>{usuario.nombre}</strong><p>Turno: Mañana</p></div>
          <LogOut size={18} />
        </div>
      </aside>
 
      <section className="cajero-content">
        {/* Header */}
        <header className="cl-header">
          <div>
            <h1>Clientes</h1>
            <p>Consulta, registra y administra la información de tus clientes</p>
          </div>
          <div className="cl-header-meta">
            <span className="cl-meta-item"><Calendar size={16} /> {fechaStr}</span>
            <span className="cl-meta-item"><WalletCards size={16} /> {horaStr}</span>
            <span className="cl-online"><span className="cl-dot" />Online</span>
          </div>
        </header>
 
        {/* Stats */}
        <div className="cl-stats">
          <div className="cl-stat-card">
            <div className="cl-stat-icon" style={{ background: "#FFF0E0" }}><Users size={24} color="#F28C00" /></div>
            <div><div className="cl-stat-label">Clientes registrados</div><div className="cl-stat-value">{totalRegistrados}</div><div className="cl-stat-sub">Total en el sistema</div></div>
          </div>
          <div className="cl-stat-card">
            <div className="cl-stat-icon" style={{ background: "#F0FFF4" }}><Star size={24} color="#10B981" /></div>
            <div><div className="cl-stat-label">Clientes frecuentes</div><div className="cl-stat-value">{totalFrecuentes}</div><div className="cl-stat-sub">Compras recurrentes</div></div>
          </div>
          <div className="cl-stat-card">
            <div className="cl-stat-icon" style={{ background: "#EFF6FF" }}><Users size={24} color="#3B82F6" /></div>
            <div><div className="cl-stat-label">Nuevos este mes</div><div className="cl-stat-value">{totalNuevos}</div><div className="cl-stat-sub">Desde el 1 de mayo</div></div>
          </div>
          <div className="cl-stat-card">
            <div className="cl-stat-icon" style={{ background: "#F5F3FF" }}><FileText size={24} color="#8B5CF6" /></div>
            <div><div className="cl-stat-label">Con factura</div><div className="cl-stat-value">{totalFactura}</div><div className="cl-stat-sub">Clientes con NIT/CI</div></div>
          </div>
        </div>
 
        {/* Main layout */}
        <div className="cl-main-layout">
          {/* Left: listado */}
          <div className="cl-listado-col">
            <div className="cl-listado-header-row">
              <h2 className="cl-listado-title">Listado de clientes</h2>
            </div>
 
            {/* Search + button */}
            <div className="cl-search-row">
              <div className="cl-input-wrap">
                <Search size={18} className="cl-input-icon" />
                <input
                  ref={inputRef}
                  className="cl-input"
                  type="text"
                  placeholder="Buscar por nombre, teléfono o NIT/CI"
                  value={busqueda}
                  onChange={(e) => { setBusqueda(e.target.value); setPagina(1); }}
                />
                {busqueda && (
                  <button className="cl-input-clear" onClick={() => setBusqueda("")}><X size={15} /></button>
                )}
              </div>
              <button className="cl-btn-nuevo">
                <Plus size={16} /> Nuevo cliente
              </button>
            </div>
 
            {/* Filtros */}
            <div className="cl-filtros">
              {(["Todos", "Frecuentes", "Con factura", "Nuevos"] as const).map((f) => (
                <button
                  key={f}
                  className={`cl-filtro-btn ${filtroActivo === f ? "active" : ""}`}
                  onClick={() => { setFiltroActivo(f); setPagina(1); }}
                >{f}</button>
              ))}
            </div>
 
            {/* Tabla */}
            <div className="cl-tabla-wrap">
              <table className="cl-tabla">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Teléfono</th>
                    <th>NIT/CI</th>
                    <th>Última compra</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clientesPagina.map((c) => (
                    <tr
                      key={c.id}
                      className={clienteSeleccionado?.id === c.id ? "cl-fila-activa" : ""}
                      onClick={() => setClienteSeleccionado(clienteSeleccionado?.id === c.id ? null : c)}
                    >
                      <td>
                        <div className="cl-cliente-cell">
                          <div className="cl-avatar" style={{ background: getColorAvatar(c.nombre) }}>
                            {getIniciales(c.nombre)}
                          </div>
                          <div>
                            <div className="cl-cliente-nombre">{c.nombre}</div>
                            {c.tipo === "frecuente" && <div className="cl-cliente-tipo">Cliente frecuente</div>}
                            {c.tipo === "nuevo" && <div className="cl-cliente-tipo nuevo">Cliente nuevo</div>}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="cl-tel-cell">
                          {c.telefono}
                          <MessageCircle size={15} color="#25D366" />
                        </div>
                      </td>
                      <td>{c.nit || <span className="cl-dash">–</span>}</td>
                      <td>{c.ultimaCompra}</td>
                      <td>
                        <span className={`cl-estado-badge ${c.estado === "Activo" ? "activo" : "inactivo"}`}>
                          <span className="cl-estado-dot" />
                          {c.estado}
                        </span>
                      </td>
                      <td>
                        <div className="cl-acciones">
                          <button className="cl-accion-btn" onClick={(e) => e.stopPropagation()}><Eye size={16} /></button>
                          <button className="cl-accion-btn" onClick={(e) => e.stopPropagation()}><MoreVertical size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
 
            {/* Paginación */}
            <div className="cl-paginacion">
              <span className="cl-pag-info">Mostrando {Math.min((pagina - 1) * ITEMS_POR_PAGINA + 1, clientesFiltrados.length)} a {Math.min(pagina * ITEMS_POR_PAGINA, clientesFiltrados.length)} de {clientesFiltrados.length} clientes</span>
              <div className="cl-pag-controles">
                <button className="cl-pag-btn" disabled={pagina === 1} onClick={() => setPagina(p => p - 1)}><ChevronLeft size={16} /></button>
                {Array.from({ length: Math.min(totalPaginas, 3) }, (_, i) => i + 1).map((n) => (
                  <button key={n} className={`cl-pag-btn ${pagina === n ? "active" : ""}`} onClick={() => setPagina(n)}>{n}</button>
                ))}
                {totalPaginas > 3 && <span className="cl-pag-dots">...</span>}
                {totalPaginas > 3 && (
                  <button className={`cl-pag-btn ${pagina === totalPaginas ? "active" : ""}`} onClick={() => setPagina(totalPaginas)}>{totalPaginas}</button>
                )}
                <button className="cl-pag-btn" disabled={pagina === totalPaginas} onClick={() => setPagina(p => p + 1)}><ChevronRight size={16} /></button>
              </div>
            </div>
          </div>
 
          {/* Right: perfil */}
          {clienteSeleccionado && (
            <aside className="cl-perfil-panel">
              <div className="cl-perfil-title">Perfil del cliente</div>
              <div className="cl-perfil-top">
                <div className="cl-perfil-avatar" style={{ background: getColorAvatar(clienteSeleccionado.nombre) }}>
                  {getIniciales(clienteSeleccionado.nombre)}
                </div>
                <div>
                  <div className="cl-perfil-nombre">{clienteSeleccionado.nombre}</div>
                  {clienteSeleccionado.tipo === "frecuente" && (
                    <span className="cl-perfil-badge frecuente">Cliente frecuente</span>
                  )}
                  {clienteSeleccionado.tipo === "nuevo" && (
                    <span className="cl-perfil-badge nuevo">Cliente nuevo</span>
                  )}
                </div>
              </div>
 
              <div className="cl-perfil-filas">
                <div className="cl-perfil-fila">
                  <Phone size={15} color="#9ca3af" />
                  <span className="cl-perfil-fila-label">Teléfono</span>
                  <span className="cl-perfil-fila-val">
                    {clienteSeleccionado.telefono}
                    <MessageCircle size={14} color="#25D366" style={{ marginLeft: 4 }} />
                  </span>
                </div>
                <div className="cl-perfil-fila">
                  <CreditCard size={15} color="#9ca3af" />
                  <span className="cl-perfil-fila-label">NIT / CI</span>
                  <span className="cl-perfil-fila-val">{clienteSeleccionado.nit || "–"}</span>
                </div>
                <div className="cl-perfil-fila">
                  <MapPin size={15} color="#9ca3af" />
                  <span className="cl-perfil-fila-label">Dirección</span>
                  <span className="cl-perfil-fila-val">{clienteSeleccionado.direccion || "–"}</span>
                </div>
                <div className="cl-perfil-fila">
                  <ShoppingBag size={15} color="#9ca3af" />
                  <span className="cl-perfil-fila-label">Total de compras</span>
                  <span className="cl-perfil-fila-val bold orange">{formatearBolivianos(clienteSeleccionado.totalCompras || 0)}</span>
                </div>
                <div className="cl-perfil-fila">
                  <Calendar size={15} color="#9ca3af" />
                  <span className="cl-perfil-fila-label">Última compra</span>
                  <span className="cl-perfil-fila-val">{clienteSeleccionado.ultimaCompra}</span>
                </div>
                <div className="cl-perfil-fila">
                  <ShoppingCart size={15} color="#9ca3af" />
                  <span className="cl-perfil-fila-label">Compras realizadas</span>
                  <span className="cl-perfil-fila-val">{clienteSeleccionado.comprasRealizadas} compras</span>
                </div>
                <div className="cl-perfil-fila">
                  <CreditCard size={15} color="#9ca3af" />
                  <span className="cl-perfil-fila-label">Forma de pago preferida</span>
                  <span className="cl-perfil-fila-val">{clienteSeleccionado.formaPagoPreferida || "–"}</span>
                </div>
                {clienteSeleccionado.notas && (
                  <div className="cl-perfil-fila">
                    <FileText size={15} color="#9ca3af" />
                    <span className="cl-perfil-fila-label">Notas</span>
                    <span className="cl-perfil-fila-val">{clienteSeleccionado.notas}</span>
                  </div>
                )}
              </div>
 
              <div className="cl-perfil-acciones">
                <button className="cl-btn-editar"><Edit size={15} /> Editar</button>
                <button className="cl-btn-venta-perfil"><ShoppingCart size={15} /> Nueva venta</button>
              </div>
 
              {/* Historial */}
              <div className="cl-historial-header">
                <span className="cl-historial-title">Historial reciente</span>
                <button className="cl-ver-mas">Ver más</button>
              </div>
              <table className="cl-historial-tabla">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Detalle</th>
                    <th>Total</th>
                    <th>Pago</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.length === 0 ? (
                    <tr><td colSpan={4} style={{ textAlign: "center", color: "#9ca3af", padding: "12px" }}>Sin historial</td></tr>
                  ) : historial.map((v, i) => (
                    <tr key={i}>
                      <td>{v.fecha}</td>
                      <td>{v.detalle}</td>
                      <td>Bs. {v.total.toFixed(2)}</td>
                      <td>
                        <span className={`cl-pago-badge ${v.pago === "Efectivo" ? "efectivo" : "tarjeta"}`}>
                          {v.pago === "Efectivo" ? <WalletCards size={12} /> : <CreditCard size={12} />}
                          {v.pago}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </aside>
          )}
        </div>
      </section>
    </main>
  );
}