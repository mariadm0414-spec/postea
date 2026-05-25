import { NextRequest, NextResponse } from "next/server";
import { LocalDbHelper } from "@/app/lib/localDb";

export const dynamic = "force-dynamic";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ chatId: string }> }
) {
    try {
        const { chatId } = await params;

        // Obtener mensajes de la base de datos local
        const messages = LocalDbHelper.getTeamMessages(chatId);

        // Ordenar por fecha de creación ascendente
        const sortedMessages = [...messages].sort((a, b) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );

        return NextResponse.json({ 
            success: true, 
            chatId,
            messages: sortedMessages
        });

    } catch (error: any) {
        console.error("Team Chat API Error:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ chatId: string }> }
) {
    try {
        const { chatId } = await params;
        const body = await request.json();
        const { content, sender_role } = body;

        const newMessage = LocalDbHelper.createTeamMessage(chatId, content, sender_role);

        return NextResponse.json({ success: true, message: newMessage });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
