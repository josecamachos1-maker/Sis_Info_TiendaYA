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
  Printer,
  Lock,
  X,
  CheckCircle2,
  Banknote,
  QrCode,
  Layers,
  Truck,
  Percent,
} from "lucide-react";
import type { UsuarioLogueado } from "../../App";
import type { VistaCajero } from "../../types/navigation";
 
type Props = {
  usuario: UsuarioLogueado;
  onNavigate: (vista: VistaCajero) => void;
};
 
type Movimiento = {
  fechaHora: string;
  movimiento: string;
  metodoPago: "Efectivo" | "QR" | "Mixto" | "Tarjeta";
  monto: number;
};
 
const MOVIMIENTOS_MOCK: Movimiento[] = [
  { fechaHora: "23/5/2026 01:20 p. m.", movimiento: "Venta #24", metodoPago: "Efectivo", monto: 30 },
  { fechaHora: "23/5/2026 12:45 p. m.", movimiento: "Venta #25", metodoPago: "QR", monto: 24 },
  { fechaHora: "23/5/2026 12:15 p. m.", movimiento: "Pedido #8 convertido", metodoPago: "Mixto", monto: 21 },
];
 
const ICONO_METODO: Record<string, ReactNode> = {
  Efectivo: <Banknote size={13} color="#16a34a" />,
  QR: <QrCode size={13} color="#7c3aed" />,
  Mixto: <Layers size={13} color="#d97706" />,
  Tarjeta: <WalletCards size={13} color="#2563eb" />,
};
 
const COLOR_METODO: Record<string, string> = {
  Efectivo: "#dcfce7",
  QR: "#ede9fe",
  Mixto: "#fef3c7",
  Tarjeta: "#dbeafe",
};
 
const COLOR_TEXTO_METODO: Record<string, string> = {
  Efectivo: "#15803d",
  QR: "#6d28d9",
  Mixto: "#b45309",
  Tarjeta: "#1d4ed8",
};
 
function formatBs(valor: number) {
  return `Bs. ${Number(valor).toLocaleString("es-BO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
 
export function CierreDeCajaPage({ usuario, onNavigate }: Props) {
  const [efectivoContado, setEfectivoContado] = useState("80,00");
  const [observaciones, setObservaciones] = useState("Caja cerrada sin novedades.");
 
  const ahora = new Date();
  const fechaStr = `${ahora.getDate()}/${ahora.getMonth() + 1}/${ahora.getFullYear()}`;
  const horaStr = ahora.toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" });
 
  // Datos del turno
  const efectivo = 78.5;
  const qr = 24.0;
  const mixto = 66.5;
  const envios = 10.0;
  const descuentos = 0.0;
  const totalRecaudado = efectivo + qr + mixto + envios - descuentos;
 
  const montoBase = 50.0;
  const efectivoEsperado = efectivo;
  const efectivoContadoNum = parseFloat(efectivoContado.replace(",", ".")) || 0;
  const diferencia = efectivoContadoNum - efectivoEsperado;
  const esSobrante = diferencia > 0;
  const esFaltante = diferencia < 0;
  const estadoOk = Math.abs(diferencia) < 5;
 
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
          <button className="menu-item" onClick={() => onNavigate("clientes")}><Users size={22} /><span>Clientes</span></button>
          <button className="menu-item active" onClick={() => onNavigate("cierre-caja")}><WalletCards size={22} /><span>Cierre de Caja</span></button>
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
        <header className="cc-header">
          <div className="cc-header-left">
            <div className="cc-header-title-row">
              <h1>Cierre de caja</h1>
              <div className="cc-header-icon"><Lock size={20} /></div>
            </div>
            <p>Finalizar turno y cerrar caja diaria</p>
          </div>
          <div className="cc-header-meta">
            <span className="cc-meta-item"><Calendar size={16} /> {fechaStr}</span>
            <span className="cc-meta-item"><Clock size={16} /> {horaStr}</span>
            <span className="cc-online"><span className="cc-dot" />Online</span>
          </div>
        </header>
 
        {/* Stats */}
        <div className="cc-stats">
          <div className="cc-stat-card">
            <div className="cc-stat-icon" style={{ background: "#F0FFF4" }}><DollarSign size={24} color="#10B981" /></div>
            <div>
              <div className="cc-stat-label">Ventas del día</div>
              <div className="cc-stat-value">{formatBs(totalRecaudado)}</div>
            </div>
          </div>
          <div className="cc-stat-card">
            <div className="cc-stat-icon" style={{ background: "#FFF7ED" }}><ShoppingBag size={24} color="#F28C00" /></div>
            <div>
              <div className="cc-stat-label">Transacciones</div>
              <div className="cc-stat-value">5</div>
            </div>
          </div>
          <div className="cc-stat-card">
            <div className="cc-stat-icon" style={{ background: "#F5F3FF" }}><FileText size={24} color="#8B5CF6" /></div>
            <div>
              <div className="cc-stat-label">Facturas emitidas</div>
              <div className="cc-stat-value">3</div>
            </div>
          </div>
          <div className="cc-stat-card">
            <div className="cc-stat-icon" style={{ background: "#EFF6FF" }}><Package size={24} color="#3B82F6" /></div>
            <div>
              <div className="cc-stat-label">Pedidos convertidos</div>
              <div className="cc-stat-value">2</div>
            </div>
          </div>
        </div>
 
        {/* Body grid */}
        <div className="cc-body-grid">
          {/* Resumen del turno */}
          <div className="cc-card">
            <div className="cc-card-title">Resumen del turno</div>
            <div className="cc-resumen-filas">
              <div className="cc-resumen-fila">
                <span className="cc-resumen-icon" style={{ background: "#dcfce7" }}><Banknote size={16} color="#16a34a" /></span>
                <span className="cc-resumen-label">Efectivo</span>
                <span className="cc-resumen-val">{formatBs(efectivo)}</span>
              </div>
              <div className="cc-resumen-fila">
                <span className="cc-resumen-icon" style={{ background: "#ede9fe" }}><QrCode size={16} color="#7c3aed" /></span>
                <span className="cc-resumen-label">QR / Transferencias</span>
                <span className="cc-resumen-val">{formatBs(qr)}</span>
              </div>
              <div className="cc-resumen-fila">
                <span className="cc-resumen-icon" style={{ background: "#fef3c7" }}><Layers size={16} color="#d97706" /></span>
                <span className="cc-resumen-label">Mixto</span>
                <span className="cc-resumen-val">{formatBs(mixto)}</span>
              </div>
              <div className="cc-resumen-fila">
                <span className="cc-resumen-icon" style={{ background: "#e0f2fe" }}><Truck size={16} color="#0284c7" /></span>
                <span className="cc-resumen-label">Envíos cobrados</span>
                <span className="cc-resumen-val">{formatBs(envios)}</span>
              </div>
              <div className="cc-resumen-fila">
                <span className="cc-resumen-icon" style={{ background: "#fee2e2" }}><Percent size={16} color="#dc2626" /></span>
                <span className="cc-resumen-label">Descuentos aplicados</span>
                <span className="cc-resumen-val">{formatBs(descuentos)}</span>
              </div>
            </div>
            <div className="cc-total-fila">
              <span>Total recaudado</span>
              <span className="cc-total-val">{formatBs(totalRecaudado)}</span>
            </div>
          </div>
 
          {/* Conteo de caja */}
          <div className="cc-card">
            <div className="cc-card-title">Conteo de caja</div>
            <div className="cc-conteo-filas">
              <div className="cc-conteo-fila">
                <span className="cc-conteo-label">Monto base inicial</span>
                <span className="cc-conteo-val">{formatBs(montoBase)}</span>
              </div>
              <div className="cc-conteo-fila">
                <span className="cc-conteo-label">Efectivo esperado</span>
                <span className="cc-conteo-val">{formatBs(efectivoEsperado)}</span>
              </div>
              <div className="cc-conteo-fila">
                <span className="cc-conteo-label">Efectivo contado</span>
                <div className="cc-input-wrap">
                  <span className="cc-input-prefix">Bs.</span>
                  <input
                    className="cc-input"
                    type="text"
                    value={efectivoContado}
                    onChange={(e) => setEfectivoContado(e.target.value)}
                  />
                </div>
              </div>
              <div className="cc-conteo-fila cc-diferencia-fila">
                <span className="cc-conteo-label">Diferencia</span>
                <div className="cc-diferencia-right">
                  <span className={`cc-diferencia-val ${esSobrante ? "sobrante" : esFaltante ? "faltante" : ""}`}>
                    {formatBs(Math.abs(diferencia))}
                  </span>
                  {esSobrante && <span className="cc-diferencia-tag sobrante">Sobrante</span>}
                  {esFaltante && <span className="cc-diferencia-tag faltante">Faltante</span>}
                  {!esSobrante && !esFaltante && <span className="cc-diferencia-tag exacto">Exacto</span>}
                </div>
              </div>
            </div>
 
            <div className={`cc-estado-cierre ${estadoOk ? "ok" : "warn"}`}>
              <CheckCircle2 size={20} color={estadoOk ? "#16a34a" : "#d97706"} />
              <div>
                <div className="cc-estado-label">Estado del cierre:</div>
                <div className={`cc-estado-val ${estadoOk ? "ok" : "warn"}`}>
                  {estadoOk ? "Listo para cerrar" : "Revisar diferencia"}
                </div>
              </div>
            </div>
          </div>
 
          {/* Observaciones */}
          <div className="cc-card">
            <div className="cc-card-title">Observaciones</div>
            <textarea
              className="cc-textarea"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={5}
            />
          </div>
 
          {/* Últimos movimientos */}
          <div className="cc-card">
            <div className="cc-card-title">Últimos movimientos</div>
            <table className="cc-mov-tabla">
              <thead>
                <tr>
                  <th>Fecha y hora</th>
                  <th>Movimiento</th>
                  <th>Método de pago</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
                {MOVIMIENTOS_MOCK.map((m, i) => (
                  <tr key={i}>
                    <td>
                      <div className="cc-mov-fecha">
                        <Clock size={13} color="#9ca3af" />
                        {m.fechaHora}
                      </div>
                    </td>
                    <td>{m.movimiento}</td>
                    <td>
                      <span
                        className="cc-metodo-badge"
                        style={{ background: COLOR_METODO[m.metodoPago], color: COLOR_TEXTO_METODO[m.metodoPago] }}
                      >
                        {ICONO_METODO[m.metodoPago]}
                        {m.metodoPago}
                      </span>
                    </td>
                    <td className="cc-mov-monto">Bs. {m.monto.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="cc-ver-todos">
              Ver todos los movimientos →
            </button>
          </div>
        </div>
 
        {/* Footer acciones */}
        <div className="cc-footer-acciones">
          <button className="cc-btn-cancelar" onClick={() => onNavigate("dashboard")}>
            <X size={16} /> Cancelar
          </button>
          <button className="cc-btn-imprimir">
            <Printer size={16} /> Imprimir resumen
          </button>
          <button className="cc-btn-cerrar">
            <Lock size={16} /> Cerrar caja
          </button>
        </div>
      </section>
    </main>
  );
}