-- Cupón de bienvenida (BIENVENIDA, 5%, mínimo 50€, primer pedido): el sistema
-- de cupones solo tenía un tope global de usos, no una restricción por
-- cliente. Se añade la columna y la comprobación correspondiente se aplica
-- en lib/order-pricing-server.js antes de calcular el descuento.
alter table public.tienda_cupones
  add column solo_primer_pedido boolean not null default false;
