import { NextResponse } from "next/server";
import { LocalDbHelper } from "@/app/lib/localDb";

export const dynamic = "force-dynamic";

export async function GET() {
    return NextResponse.json({ message: "Login API is reachable (Local)" });
}

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        const cleanEmail = email.trim().toLowerCase();

        // 1. Intentar buscar el usuario en la base de datos local
        const user = LocalDbHelper.getUser(cleanEmail);

        if (!user) {
            return NextResponse.json({ error: "Correo o contraseña incorrectos" }, { status: 401 });
        }

        // 2. Verificar la contraseña (comparación local simple para el entorno local)
        if (user.password !== password) {
            return NextResponse.json({ error: "Correo o contraseña incorrectos" }, { status: 401 });
        }

        // 3. Verificar que el correo esté en la lista de autorizados
        const authorized = LocalDbHelper.getAuthorizedUser(cleanEmail);

        if (!authorized) {
            return NextResponse.json({
                error: "Acceso denegado. Este correo no figura en la lista de compradores autorizados."
            }, { status: 403 });
        }

        // 4. Todo bien, regresamos el usuario
        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.full_name || "Usuario",
            }
        });

    } catch (error) {
        console.error("Critical Login Error:", error);
        return NextResponse.json({ error: "Error en el servidor de autenticación" }, { status: 500 });
    }
}
