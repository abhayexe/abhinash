import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hfqudbuaxvgcdqmbptkf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmcXVkYnVheHZnY2RxbWJwdGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMjgwNjEsImV4cCI6MjA1ODgwNDA2MX0.OA4hsX2x8Eobt9y2XMQqytt8QRGkWf5d_sgeXc0wF_w';

export const supabase = createClient(supabaseUrl, supabaseKey);