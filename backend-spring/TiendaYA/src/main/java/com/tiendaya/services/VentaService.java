package com.tiendaya.services;

import com.tiendaya.dtos.CreateVentaDto;
import com.tiendaya.dtos.UpdateVentaDto;
import com.tiendaya.interfaces.IVentaService;
import com.tiendaya.models.Pago;
import com.tiendaya.models.Pedido;
import com.tiendaya.models.PedidoDetalle;
import com.tiendaya.models.Producto;
import com.tiendaya.models.Venta;
import com.tiendaya.models.enums.EstadoPago;
import com.tiendaya.models.enums.EstadoPedido;
import com.tiendaya.models.enums.EstadoVenta;
import com.tiendaya.repositories.PagoRepository;
import com.tiendaya.repositories.PedidoRepository;
import com.tiendaya.repositories.VentaRepository;
import com.tiendaya.repositories.ProductoRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VentaService implements IVentaService {

    private final VentaRepository ventaRepository;
    private final PedidoRepository pedidoRepository;
    private final PagoRepository pagoRepository;
    private final ProductoRepository productoRepository;

    public VentaService(
            VentaRepository ventaRepository,
            PedidoRepository pedidoRepository,
            PagoRepository pagoRepository,
            ProductoRepository productoRepository
    ) {
        this.ventaRepository = ventaRepository;
        this.pedidoRepository = pedidoRepository;
        this.pagoRepository = pagoRepository;
        this.productoRepository = productoRepository;
    }

    @Override
    public List<Venta> getVentas() {
        return ventaRepository.findByActivoTrueOrderByIdAsc();
    }

    @Override
    public Optional<Venta> getVenta(Integer id) {
        return ventaRepository.findById(id);
    }

    @Override
    public Optional<Venta> getVentaPorPedido(Integer pedidoId) {
        return ventaRepository.findByPedidoId(pedidoId);
    }

    @Override
    public List<Venta> getVentasPorEstado(EstadoVenta estadoVenta) {
        return ventaRepository.findByEstadoVentaOrderByIdAsc(estadoVenta);
    }

    @Override
    @Transactional
    public Venta createVenta(CreateVentaDto dto) {
        Pedido pedido = pedidoRepository.findById(dto.pedidoId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "El pedido con id " + dto.pedidoId() + " no existe"
                ));

        if (pedido.getEstado() == EstadoPedido.CANCELADO) {
            throw new IllegalArgumentException("No se puede registrar venta para un pedido cancelado");
        }

        if (ventaRepository.existsByPedidoId(dto.pedidoId())) {
            throw new IllegalArgumentException("Este pedido ya tiene una venta registrada");
        }

        if (dto.pagoId() == null) {
            throw new IllegalArgumentException("Para registrar una venta se necesita un pago confirmado");
        }

        Pago pago = obtenerPagoValido(dto.pagoId(), pedido.getId());

        if (ventaRepository.existsByPagoId(dto.pagoId())) {
            throw new IllegalArgumentException("Este pago ya está asociado a una venta");
        }

        if (pago.getMonto().compareTo(pedido.getTotal()) != 0) {
            throw new IllegalArgumentException("El monto del pago no coincide con el total del pedido");
        }

        Venta venta = new Venta();

        venta.setPedido(pedido);
        venta.setPago(pago);

        // La venta toma el total real del pedido.
        venta.setMontoTotal(pedido.getTotal());

        // La venta toma el método real del pago.
        venta.setMetodoPago(pago.getMetodo());

        // Si hay pago confirmado, la venta ya queda completada.
        venta.setEstadoVenta(EstadoVenta.COMPLETADA);

        venta.setComprobante(dto.comprobante());
        venta.setActivo(true);

        // Como la venta ya fue completada, el pedido deja de estar pendiente.
        pedido.setEstado(EstadoPedido.ENTREGADO);
        pedidoRepository.save(pedido);

        return ventaRepository.save(venta);
    }

    @Override
    @Transactional
    public Optional<Venta> updateVenta(Integer id, UpdateVentaDto dto) {
        Optional<Venta> ventaBuscada = ventaRepository.findById(id);

        if (ventaBuscada.isEmpty()) {
            return Optional.empty();
        }

        Venta venta = ventaBuscada.get();

        if (dto.pagoId() != null) {
            Pago pago = obtenerPagoValido(dto.pagoId(), venta.getPedido().getId());

            if (ventaRepository.existsByPagoId(dto.pagoId())
                    && (venta.getPago() == null || !venta.getPago().getId().equals(dto.pagoId()))) {
                throw new IllegalArgumentException("Este pago ya está asociado a otra venta");
            }

            venta.setPago(pago);
            venta.setMetodoPago(pago.getMetodo());
            venta.setMontoTotal(venta.getPedido().getTotal());
        }

        if (dto.comprobante() != null) {
            venta.setComprobante(dto.comprobante());
        }

        if (dto.estadoVenta() != null) {
            if (dto.estadoVenta() == EstadoVenta.COMPLETADA) {
                completarVenta(venta);
            }

            if (dto.estadoVenta() == EstadoVenta.CANCELADA) {
                cancelarVenta(venta);
            }

            if (dto.estadoVenta() == EstadoVenta.PENDIENTE) {
                venta.setEstadoVenta(EstadoVenta.PENDIENTE);
            }
        }

        if (dto.activo() != null) {
            venta.setActivo(dto.activo());
        }

        return Optional.of(ventaRepository.save(venta));
    }

    @Override
    @Transactional
    public Optional<Venta> deleteVenta(Integer id) {
        Optional<Venta> ventaBuscada = ventaRepository.findById(id);

        if (ventaBuscada.isEmpty()) {
            return Optional.empty();
        }

        Venta venta = ventaBuscada.get();

        cancelarVenta(venta);

        return Optional.of(ventaRepository.save(venta));
    }

    private Pago obtenerPagoValido(Integer pagoId, Integer pedidoId) {
        Pago pago = pagoRepository.findById(pagoId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "El pago con id " + pagoId + " no existe"
                ));

        if (pago.getPedido() == null) {
            throw new IllegalArgumentException("El pago no tiene pedido asociado");
        }

        if (!pago.getPedido().getId().equals(pedidoId)) {
            throw new IllegalArgumentException("El pago no pertenece al pedido seleccionado");
        }

        if (pago.getEstadoPago() != EstadoPago.CONFIRMADO) {
            throw new IllegalArgumentException("El pago todavía no está confirmado");
        }

        return pago;
    }

    private void completarVenta(Venta venta) {
        if (venta.getPago() == null) {
            throw new IllegalArgumentException("No se puede completar una venta sin pago");
        }

        if (venta.getPago().getEstadoPago() != EstadoPago.CONFIRMADO) {
            throw new IllegalArgumentException("No se puede completar la venta porque el pago no está confirmado");
        }

        venta.setEstadoVenta(EstadoVenta.COMPLETADA);
        venta.setActivo(true);
        venta.setMontoTotal(venta.getPedido().getTotal());
        venta.setMetodoPago(venta.getPago().getMetodo());

        Pedido pedido = venta.getPedido();

        if (pedido.getEstado() != EstadoPedido.CANCELADO) {
            pedido.setEstado(EstadoPedido.ENTREGADO);
            pedidoRepository.save(pedido);
        }
    }

    private void cancelarVenta(Venta venta) {
        if (venta.getEstadoVenta() == EstadoVenta.CANCELADA) {
            return;
        }

        venta.setEstadoVenta(EstadoVenta.CANCELADA);
        venta.setActivo(false);

        Pago pago = venta.getPago();

        if (pago != null && pago.getEstadoPago() == EstadoPago.CONFIRMADO) {
            pago.setEstadoPago(EstadoPago.REEMBOLSADO);
            pagoRepository.save(pago);
        }

        Pedido pedido = venta.getPedido();

        if (pedido != null && pedido.getEstado() != EstadoPedido.CANCELADO) {
            restaurarStockDelPedido(pedido);
            pedido.setEstado(EstadoPedido.CANCELADO);
            pedidoRepository.save(pedido);
        }
    }

    private void restaurarStockDelPedido(Pedido pedido) {
        for (PedidoDetalle detalle : pedido.getDetalles()) {
            Producto producto = detalle.getProducto();

            producto.setStock(producto.getStock() + detalle.getCantidad());

            productoRepository.save(producto);
        }
    }
}