-- api/conversion.js acepta 'repair_step', 'repair_form_abandon', 'calculator_result'
-- y 'calculator_lead' desde hace unos días, pero la restricción CHECK de esta
-- tabla nunca se actualizó — cada uno de esos eventos fallaba con un 400.
alter table public.tienda_conversion_eventos
  drop constraint tienda_conversion_eventos_evento_check,
  add constraint tienda_conversion_eventos_evento_check check (evento = any (array[
    'page_view','view_item','add_to_cart','remove_from_cart',
    'view_cart','begin_checkout','order_created','purchase','repair_request',
    'whatsapp_click','phone_click','repair_cta_click',
    'repair_form_start','repair_step','repair_login_gate','checkout_login_gate',
    'repair_form_abandon','calculator_result','calculator_lead'
  ]));
