import { createClient } from '@supabase/supabase-js';

// Vercel 환경변수 세팅이 번거로우므로 직접 하드코딩
const supabaseUrl = 'https://jwofoyrywdmynrlrymbt.supabase.co';
const supabaseKey = 'sb_publishable_todOFum6LKL2D1xwG6Vq8g_1UZLaRCh';

export const supabase = createClient(supabaseUrl, supabaseKey);
