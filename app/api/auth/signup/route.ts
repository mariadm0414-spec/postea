import { NextResponse } from "next/server";
import { LocalDbHelper } from "@/app/lib/localDb";

export const dynamic = "force-dynamic";

export async function GET() {
    return NextResponse.json({ message: "Signup API is reachable (Local)" });
}

export async function POST(req: Request) {
    try {
        const { email, password, full_name } = await req.json();
        const cleanEmail = email.trim().toLowerCase();

        if (!cleanEmail || !password) {
            return NextResponse.json({ error: "El correo y la contraseña son requeridos" }, { status: 400 });
        }

        // Crear/Actualizar el usuario en la base de datos local
        // Nota: esto auto-autoriza al usuario en authorized_users
        LocalDbHelper.createUser(cleanEmail, password, full_name || "Usuario Registrado");

        return NextResponse.json({ message: "Registro completado con éxito (Local)" });

    } catch (error) {
        console.error("Critical Signup Error:", error);
        return NextResponse.json({ error: "Error interno al procesar el registro" }, { status: 500 });
    }
}
