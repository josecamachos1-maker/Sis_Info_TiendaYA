import { useState, type ReactNode } from "react";
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
  Calendar, 
  Clock, 
  DollarSign, 
  ShoppingBag,
  FileText, 
  Package, 
  TrendingUp, 
  ArrowUpRight,
  Filter, 
  RefreshCw, 
  FileDown, 
  TableProperties,
  Bike,
} from "lucide-react";
import type { UsuarioLogueado } from "../../App";
import type { VistaCajero } from "../../types/navigation";
 
type Props = {
  usuario: UsuarioLogueado;
  onNavigate: (vista: VistaCajero) => void;
};
 
// ── Datos mock ──────────────────────────────────────────────
const VENTAS_POR_DIA = [
  { dia: "16/05", valor: 1120 },
  { dia: "17/05", valor: 1345 },
  { dia: "18/05", valor: 1210 },
  { dia: "19/05", valor: 1640 },
  { dia: "20/05", valor: 1005 },
  { dia: "21/05", valor: 1355 },
  { dia: "22/05", valor: 1170 },
  { dia: "23/05", valor: 1000 },
];
 
const PRODUCTOS_TOP = [
  { pos: 1, nombre: "Pan Batido",         cant: 342, emoji: "🍞" },
  { pos: 2, nombre: "Coca Cola 600 ml",   cant: 268, emoji: "🥤" },
  { pos: 3, nombre: "Arroz Premium 1 kg", cant: 214, emoji: "🌾" },
  { pos: 4, nombre: "Leche Pil Andina 1L",cant: 183, emoji: "🥛" },
  { pos: 5, nombre: "Azúcar Guabirá 1 kg",cant: 165, emoji: "🍬" },
];
 
const METODOS_PAGO = [
  { label: "Efectivo",          pct: 56, color: "#10B981", monto: 4396.40 },
  { label: "QR / Transferencia",pct: 29, color: "#3B82F6", monto: 2277.40 },
  { label: "Mixto",             pct: 15, color: "#F28C00", monto: 1172.80 },
];
 
type MetodoPago = "Efectivo" | "QR" | "Mixto";
 
const MOVIMIENTOS = [
  { fecha: "23/05/2026 01:20 p. m.", tipo: "Venta",  cliente: "Juan Pérez",      metodo: "Efectivo" as MetodoPago, total: 120,  estado: "Completado" },
  { fecha: "23/05/2026 12:45 p. m.", tipo: "Pedido", cliente: "María Camacho",   metodo: "QR"       as MetodoPago, total: 96,   estado: "Entregado"  },
  { fecha: "23/05/2026 11:30 a. m.", tipo: "Venta",  cliente: "Luis Rojas",      metodo: "Mixto"    as MetodoPago, total: 78.5, estado: "Completado" },
  { fecha: "23/05/2026 10:15 a. m.", tipo: "Pedido", cliente: "Sofía Andrade",   metodo: "Efectivo" as MetodoPago, total: 145,  estado: "Entregado"  },
  { fecha: "23/05/2026 09:42 a. m.", tipo: "Venta",  cliente: "Gabriel Condori", metodo: "QR"       as MetodoPago, total: 62,   estado: "Completado" },
];
 
function formatBs(v: number) {
  return `Bs. ${v.toLocaleString("es-BO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
 
// ── Donut SVG puro ──────────────────────────────────────────
function DonutChart() {
  const cx = 90, cy = 90, r = 65, stroke = 28;
  const circ = 2 * Math.PI * r;
  const pcts = METODOS_PAGO.map(m => m.pct);
  let offset = 0;
  const slices = pcts.map((p, i) => {
    const len = (p / 100) * circ;
    const dash = `${len} ${circ - len}`;
    const rotate = offset * 3.6 - 90;
    offset += p;
    return { dash, rotate, color: METODOS_PAGO[i].color };
  });
 
  return (
    <svg viewBox="0 0 180 180" width="180" height="180">
      {slices.map((s, i) => (
        <circle
          key={i}
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={s.color}
          strokeWidth={stroke}
          strokeDasharray={s.dash}
          strokeDashoffset={0}
          transform={`rotate(${s.rotate} ${cx} ${cy})`}
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
      ))}
      <circle cx={cx} cy={cy} r={r - stroke / 2 - 2} fill="white" />
      <text x={cx} y={cy - 8}  textAnchor="middle" fontSize="11" fill="#6b7280" fontWeight="600">Total</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="13" fill="#111827" fontWeight="800">Bs. 7.845</text>
    </svg>
  );
}
 
// ── Bar chart SVG puro ──────────────────────────────────────
function BarChart() {
  const max = Math.max(...VENTAS_POR_DIA.map(d => d.valor));
  const W = 420, H = 160, pad = { l: 40, r: 10, t: 20, b: 30 };
  const bw = (W - pad.l - pad.r) / VENTAS_POR_DIA.length;
  const barW = bw * 0.55;
 
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
      {/* Y labels */}
      {[0, 500, 1000, 1500, 2000].map(v => {
        const y = pad.t + (H - pad.t - pad.b) * (1 - v / max);
        return (
          <g key={v}>
            <line x1={pad.l} x2={W - pad.r} y1={y} y2={y} stroke="#f3f4f6" strokeWidth="1" />
            <text x={pad.l - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#9ca3af">{v === 0 ? "0" : `${v/1000}k`}</text>
          </g>
        );
      })}
      {/* Bars */}
      {VENTAS_POR_DIA.map((d, i) => {
        const x = pad.l + i * bw + (bw - barW) / 2;
        const barH = (d.valor / max) * (H - pad.t - pad.b);
        const y = pad.t + (H - pad.t - pad.b) - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx="5" fill="#F28C00" />
            <text x={x + barW / 2} y={y - 5} textAnchor="middle" fontSize="9" fill="#374151" fontWeight="700">
              {(d.valor / 1000).toFixed(3).replace(".", ",")}
            </text>
            <text x={x + barW / 2} y={H - 4} textAnchor="middle" fontSize="9" fill="#9ca3af">{d.dia}</text>
          </g>
        );
      })}
    </svg>
  );
}
 
const METODO_BADGE: Record<MetodoPago, ReactNode> = {
  Efectivo: <span className="rp-badge efectivo">✓ Efectivo</span>,
  QR:       <span className="rp-badge qr">⊞ QR</span>,
  Mixto:    <span className="rp-badge mixto">▤ Mixto</span>,
};
 
const ESTADO_BADGE: Record<string, ReactNode> = {
  Completado: <span className="rp-estado completado">Completado</span>,
  Entregado:  <span className="rp-estado entregado">Entregado</span>,
};
 
const TIPO_BADGE: Record<string, ReactNode> = {
  Venta:  <span className="rp-tipo venta">🛒 Venta</span>,
  Pedido: <span className="rp-tipo pedido">📋 Pedido</span>,
};
 
// ── Componente principal ────────────────────────────────────
export function ReportesPage({ usuario, onNavigate }: Props) {
  const [desde, setDesde]     = useState("16/05/2026");
  const [hasta, setHasta]     = useState("23/05/2026");
  const [metodo, setMetodo]   = useState("Todos");
  const [estado, setEstado]   = useState("Todos");
 
  const ahora = new Date();
  const fechaStr = `${ahora.getDate()}/${ahora.getMonth() + 1}/${ahora.getFullYear()}`;
  const horaStr  = ahora.toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" });
 
  return (
    <main className="cajero-dashboard">
      {/* ── Sidebar ── */}
      <aside className="cajero-sidebar">
        <div className="cajero-logo">
          <span className="logo-text-small">tienda</span>
          <span className="logo-text-main">Ya!</span>
        </div>
        <nav className="cajero-menu">
          <button className="menu-item" onClick={() => onNavigate("dashboard")}><LayoutDashboard size={22}/><span>Dashboard</span></button>
          <button className="menu-item" onClick={() => onNavigate("nueva-venta")}><ShoppingCart size={22}/><span>Nueva Venta</span></button>
          <button className="menu-item" onClick={() => onNavigate("registrar-pedido")}><ClipboardList size={22}/><span>Registrar Pedido</span></button>
          <button className="menu-item" onClick={() => onNavigate("buscar-producto")}><Search size={22}/><span>Buscar Producto</span></button>
          <button className="menu-item" onClick={() => onNavigate("pedidos-pendientes")}><PackageCheck size={22}/><span>Pedidos Pendientes</span></button>
          <button className="menu-item" onClick={() => onNavigate("clientes")}><Users size={22}/><span>Clientes</span></button>
          <button className="menu-item" onClick={() => onNavigate("cierre-caja")}><WalletCards size={22}/><span>Cierre de Caja</span></button>
          <button className="menu-item active" onClick={() => onNavigate("reportes")}><BarChart3 size={22}/><span>Reportes</span></button>
          <button className="menu-item" onClick={() => onNavigate("configuracion")}><Settings size={22}/><span>Configuración</span></button>
        </nav>
        <div className="sidebar-user">
          <div className="sidebar-user-icon"><Users size={22}/></div>
          <div><strong>{usuario.nombre}</strong><p>Turno: Mañana</p></div>
          <LogOut size={18}/>
        </div>
      </aside>
 
      {/* ── Content ── */}
      <section className="cajero-content">
 
        {/* Header */}
        <header className="rp-header">
          <div>
            <h1>Reportes</h1>
            <p>Consulta ventas, pedidos y rendimiento del negocio</p>
          </div>
          <div className="rp-header-meta">
            <span className="rp-meta-item"><Calendar size={16}/> {fechaStr}</span>
            <span className="rp-meta-item"><Clock size={16}/> {horaStr}</span>
            <span className="rp-online"><span className="rp-dot"/>Online</span>
          </div>
        </header>
 
        {/* Filtros */}
        <div className="rp-filtros-bar">
          <div className="rp-filtro-group">
            <label>Desde</label>
            <div className="rp-input-wrap">
              <Calendar size={14} className="rp-input-icon"/>
              <input className="rp-input" value={desde} onChange={e => setDesde(e.target.value)}/>
            </div>
          </div>
          <div className="rp-filtro-group">
            <label>Hasta</label>
            <div className="rp-input-wrap">
              <Calendar size={14} className="rp-input-icon"/>
              <input className="rp-input" value={hasta} onChange={e => setHasta(e.target.value)}/>
            </div>
          </div>
          <div className="rp-filtro-group">
            <label>Método de pago</label>
            <select className="rp-select" value={metodo} onChange={e => setMetodo(e.target.value)}>
              <option>Todos</option>
              <option>Efectivo</option>
              <option>QR</option>
              <option>Mixto</option>
            </select>
          </div>
          <div className="rp-filtro-group">
            <label>Estado</label>
            <select className="rp-select" value={estado} onChange={e => setEstado(e.target.value)}>
              <option>Todos</option>
              <option>Completado</option>
              <option>Entregado</option>
            </select>
          </div>
          <div className="rp-filtro-acciones">
            <button className="rp-btn-aplicar"><Filter size={15}/> Aplicar</button>
            <button className="rp-btn-limpiar"><RefreshCw size={15}/> Limpiar</button>
          </div>
          <div className="rp-export-btns">
            <button className="rp-btn-export pdf"><FileDown size={15}/> Exportar PDF</button>
            <button className="rp-btn-export excel"><TableProperties size={15}/> Exportar Excel</button>
          </div>
        </div>
 
        {/* KPI stats */}
        <div className="rp-stats">
          <div className="rp-stat-card">
            <div className="rp-stat-icon" style={{ background: "#F0FFF4" }}><DollarSign size={24} color="#10B981"/></div>
            <div>
              <div className="rp-stat-label">Ventas totales</div>
              <div className="rp-stat-value">Bs. 7.845,60</div>
              <div className="rp-stat-sub"><ArrowUpRight size={12} color="#10B981"/> <span className="verde">12,6%</span> vs periodo anterior</div>
            </div>
          </div>
          <div className="rp-stat-card">
            <div className="rp-stat-icon" style={{ background: "#FFF7ED" }}><ShoppingBag size={24} color="#F28C00"/></div>
            <div>
              <div className="rp-stat-label">Pedidos entregados</div>
              <div className="rp-stat-value">136</div>
              <div className="rp-stat-sub"><ArrowUpRight size={12} color="#10B981"/> <span className="verde">8,3%</span> vs periodo anterior</div>
            </div>
          </div>
          <div className="rp-stat-card">
            <div className="rp-stat-icon" style={{ background: "#F5F3FF" }}><TrendingUp size={24} color="#8B5CF6"/></div>
            <div>
              <div className="rp-stat-label">Ticket promedio</div>
              <div className="rp-stat-value">Bs. 57,68</div>
              <div className="rp-stat-sub"><ArrowUpRight size={12} color="#10B981"/> <span className="verde">5,7%</span> vs periodo anterior</div>
            </div>
          </div>
          <div className="rp-stat-card">
            <div className="rp-stat-icon" style={{ background: "#EFF6FF" }}><FileText size={24} color="#3B82F6"/></div>
            <div>
              <div className="rp-stat-label">Facturas emitidas</div>
              <div className="rp-stat-value">112</div>
              <div className="rp-stat-sub"><ArrowUpRight size={12} color="#10B981"/> <span className="verde">14,1%</span> vs periodo anterior</div>
            </div>
          </div>
        </div>
 
        {/* Gráficas row */}
        <div className="rp-graficas-row">
          {/* Ventas por día */}
          <div className="rp-card rp-card-barras">
            <div className="rp-card-header">
              <span className="rp-card-title">Ventas por día</span>
              <button className="rp-chip">Total (Bs.) ▾</button>
            </div>
            <div className="rp-barchart-wrap">
              <BarChart/>
            </div>
          </div>
 
          {/* Métodos de pago */}
          <div className="rp-card rp-card-donut">
            <div className="rp-card-header">
              <span className="rp-card-title">Métodos de pago</span>
            </div>
            <div className="rp-donut-layout">
              <DonutChart/>
              <div className="rp-donut-leyenda">
                {METODOS_PAGO.map(m => (
                  <div className="rp-leyenda-item" key={m.label}>
                    <span className="rp-leyenda-dot" style={{ background: m.color }}/>
                    <div>
                      <div className="rp-leyenda-label">{m.label}</div>
                      <div className="rp-leyenda-sub">{formatBs(m.monto)} ({m.pct}%)</div>
                    </div>
                  </div>
                ))}
                <div className="rp-leyenda-total">Total: {formatBs(7845.60)}</div>
              </div>
            </div>
          </div>
 
          {/* Productos más vendidos */}
          <div className="rp-card rp-card-productos">
            <div className="rp-card-header">
              <span className="rp-card-title">Productos más vendidos</span>
              <span className="rp-card-cant-label">Cant.</span>
            </div>
            <div className="rp-productos-lista">
              {PRODUCTOS_TOP.map(p => (
                <div className="rp-producto-fila" key={p.pos}>
                  <span className="rp-prod-pos">{p.pos}</span>
                  <span className="rp-prod-emoji">{p.emoji}</span>
                  <span className="rp-prod-nombre">{p.nombre}</span>
                  <span className="rp-prod-cant">{p.cant}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
 
        {/* Movimientos + Resumen canal */}
        <div className="rp-bottom-row">
          {/* Últimos movimientos */}
          <div className="rp-card rp-card-movimientos">
            <div className="rp-card-header">
              <span className="rp-card-title">Últimos movimientos</span>
            </div>
            <table className="rp-tabla">
              <thead>
                <tr>
                  <th>Fecha</th><th>Tipo</th><th>Cliente</th>
                  <th>Método</th><th>Total</th><th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {MOVIMIENTOS.map((m, i) => (
                  <tr key={i}>
                    <td className="rp-fecha-cell">{m.fecha}</td>
                    <td>{TIPO_BADGE[m.tipo]}</td>
                    <td className="rp-cliente-cell">{m.cliente}</td>
                    <td>{METODO_BADGE[m.metodo]}</td>
                    <td className="rp-monto-cell">{formatBs(m.total)}</td>
                    <td>{ESTADO_BADGE[m.estado]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="rp-ver-todos">Ver todos los movimientos →</button>
          </div>
 
          {/* Resumen por canal */}
          <div className="rp-card rp-card-canal">
            <div className="rp-card-header">
              <span className="rp-card-title">Resumen por canal</span>
              <button className="rp-chip">Total (Bs.) ▾</button>
            </div>
            <div className="rp-canal-grid">
              <div className="rp-canal-item verde">
                <div className="rp-canal-icon verde"><Package size={22} color="#10B981"/></div>
                <div>
                  <div className="rp-canal-nombre">Nueva venta</div>
                  <div className="rp-canal-val">Bs. 5.420,80</div>
                  <div className="rp-canal-sub">69% del total</div>
                  <div className="rp-barra-wrap"><div className="rp-barra" style={{ width: "69%", background: "#10B981" }}/></div>
                </div>
              </div>
              <div className="rp-canal-item naranja">
                <div className="rp-canal-icon naranja"><Bike size={22} color="#F28C00"/></div>
                <div>
                  <div className="rp-canal-nombre ">Pedidos delivery</div>
                  <div className="rp-canal-val">Bs. 2.424,80</div>
                  <div className="rp-canal-sub">31% del total</div>
                  <div className="rp-barra-wrap"><div className="rp-barra" style={{ width: "31%", background: "#F28C00" }}/></div>
                </div>
              </div>
            </div>
            <div className="rp-canal-transacciones">
              <div className="rp-trans-item">
                <span>Transacciones</span><span className="rp-trans-val">94</span>
              </div>
              <div className="rp-trans-item">
                <span>Transacciones</span><span className="rp-trans-val">42</span>
              </div>
            </div>
            <div className="rp-total-general">
              <span>Total general</span>
              <span className="rp-total-val">{formatBs(7845.60)}</span>
            </div>
          </div>
        </div>
 
      </section>
    </main>
  );
}
 