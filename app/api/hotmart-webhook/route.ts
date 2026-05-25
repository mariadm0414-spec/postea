import { NextResponse } from "next/server";
import { LocalDbHelper } from "@/app/lib/localDb";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const event = body.event;
        const data = body.data;

        const email = data.buyer?.email?.toLowerCase();
        const fullName = data.buyer?.name;

        // Si no hay email, no podemos hacer nada. Respondemos 200 para que Hotmart deje de reintentar
        if (!email) {
            console.log(`Skipping event ${event}: No email provided in payload.`);
            return NextResponse.json({ success: true, message: "Process skipped: no email" });
        }

        console.log(`Hotmart Event: ${event} for ${email} (Local)`);

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
            console.log(`Processing event ${event} for ${email} - Ensuring user is active in local DB`);
            
            // Agregar o actualizar el usuario en la lista autorizada local
            LocalDbHelper.addAuthorizedUser(
                email.toLowerCase().trim(),
                fullName || "Comprador Hotmart",
                'active'
            );
        } else {
            console.log(`Event ${event} ignored as it's not a primary purchase event.`);
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Hotmart Webhook Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
