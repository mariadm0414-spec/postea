import { NextRequest, NextResponse } from "next/server";
import { LocalDbHelper } from "@/app/lib/localDb";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    try {
        // Obtener todos los chats del equipo desde la base de datos local
        const chats = LocalDbHelper.getTeamChats();
        
        // Ordenar por updated_at descendiente
        const sortedChats = [...chats].sort((a, b) => 
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );

        return NextResponse.json({ success: true, chats: sortedChats });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, agents } = body;

        const newChat = LocalDbHelper.createTeamChat(title, agents);

        return NextResponse.json({ success: true, chat: newChat });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
