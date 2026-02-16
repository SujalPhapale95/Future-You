const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function check() {
    console.log('Checking database connection...');

    // Try to select from contracts
    const { data, error } = await supabase.from('contracts').select('*').limit(1);

    if (error) {
        console.error('Error querying contracts table:', error);
        if (error.code === '42P01') {
            console.log('DIAGNOSIS: Table "contracts" does not exist.');
        } else {
            console.log('DIAGNOSIS: Other error.', error.message);
        }
    } else {
        console.log('Success! Contracts table exists.');
        console.log('Row count:', data.length);
    }
}

check();
