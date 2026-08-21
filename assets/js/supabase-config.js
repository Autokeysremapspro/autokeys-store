/* AutoKeys Remaps Pro Store — Supabase connection (public/anon key only).
   The anon/publishable key is safe to expose client-side: every table it
   can touch is locked down with row level security. tienda_pedidos,
   tienda_pedido_lineas and tienda_clientes only accept reads/writes from
   an authenticated session, scoped to that user's own rows (auth.uid()) —
   the anon role has no policies on any of them. */

const AK_SUPABASE_URL = 'https://pbldwfzzyofpbpojzsjg.supabase.co';
const AK_SUPABASE_ANON_KEY = 'sb_publishable_UMSdVTexHpOImBBonUJKdw_s7XgKVeq';

let _akSupabaseClient = null;
function akSupabase() {
  if (!_akSupabaseClient) {
    _akSupabaseClient = window.supabase.createClient(AK_SUPABASE_URL, AK_SUPABASE_ANON_KEY);
  }
  return _akSupabaseClient;
}
