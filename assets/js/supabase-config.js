/* AutoKeys Remaps Pro Store — Supabase connection (public/anon key only).
   The anon/publishable key is safe to expose client-side: every table it
   can touch is locked down with row level security. The checkout writes
   to tienda_pedidos / tienda_pedido_lineas, which only accept INSERT from
   this key — no read, update or delete. */

const AK_SUPABASE_URL = 'https://pbldwfzzyofpbpojzsjg.supabase.co';
const AK_SUPABASE_ANON_KEY = 'sb_publishable_UMSdVTexHpOImBBonUJKdw_s7XgKVeq';

let _akSupabaseClient = null;
function akSupabase() {
  if (!_akSupabaseClient) {
    _akSupabaseClient = window.supabase.createClient(AK_SUPABASE_URL, AK_SUPABASE_ANON_KEY);
  }
  return _akSupabaseClient;
}
