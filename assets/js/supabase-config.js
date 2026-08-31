/* AutoKeys Remaps Pro Store — Supabase connection (public/publishable key only). */

const AK_SUPABASE_URL = 'https://pbldwfzzyofpbpojzsjg.supabase.co';
const AK_SUPABASE_ANON_KEY = 'sb_publishable_UMSdVTexHpOImBBonUJKdw_s7XgKVeq';

let _akSupabaseClient = null;
function akSupabase() {
  if (!_akSupabaseClient) {
    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
      throw new Error('Supabase JS no está disponible');
    }
    _akSupabaseClient = window.supabase.createClient(AK_SUPABASE_URL, AK_SUPABASE_ANON_KEY);
  }
  return _akSupabaseClient;
}

/* Sobrescribe explícitamente cualquier fallback temporal creado por catalog.js. */
akSupabase.__akFallback = false;
window.akSupabase = akSupabase;
