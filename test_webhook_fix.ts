
import { createClient } from "@supabase/supabase-js";

// Manually using the keys from .env.local for testing purposes
const SUPABASE_URL = "https://wupnhdwkeoysqdgwcfox.supabase.co";
const SERVICE_ROLE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1cG5oZHdrZW95c3FkZ3djZm94Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzQzNjMyNiwiZXhwIjoyMDg5MDEyMzI2fQ.B71T5pKCVG0qZFm7w-geOfUkdH09yCtjcKnoOUxV7hA";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

async function simulateWebhook(event: string, email: string, name: string) {
    console.log(`\n--- Simulating Event: ${event} for ${email} ---`);

    // Simulating the logic inside the webhook
    const validEvents = [
        'PUR_APPROVED',
        'PUR_COMPLETE',
        'BIL_PRINTED',
        'PUR_DELAYED',
        'PUR_PROTESTED',
        'PAYMENT_OUT_OF_BANDS',
        'PUR_CANCELED',
        'PUR_REFUNDED',
        'PUR_EXPIRED',
        'PUR_CHARGEBACK',
        'SUBSCRIPTION_CANCELLATION'
    ];

    if (validEvents.includes(event)) {
        console.log(`Processing event ${event} for ${email} - Ensuring user is active`);
        const { error } = await supabase
            .from('authorized_users')
            .upsert({
                email: email.toLowerCase(),
                full_name: name,
                status: 'active'
            }, { onConflict: 'email' });

        if (error) {
            console.error("Supabase Error:", error);
        } else {
            console.log("Success: User set to active");
        }
    } else {
        console.log(`Event ${event} ignored.`);
    }

    // Verify status
    const { data } = await supabase
        .from('authorized_users')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

    console.log("Current Record in Supabase:", data);
}

async function runTests() {
    const testEmail = "test_webhook_user@example.com";

    // 1. First Approved
    await simulateWebhook('PUR_APPROVED', testEmail, "Test User");

    // 2. Then Canceled (should still be active according to new logic)
    await simulateWebhook('PUR_CANCELED', testEmail, "Test User");

    // 3. Subscription Cancellation (should still be active)
    await simulateWebhook('SUBSCRIPTION_CANCELLATION', testEmail, "Test User");
}

runTests().catch(console.error);
