import { NextResponse } from "next/server";
import { generateFormToken } from "@/lib/izipay";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { amount, currency, orderId, email } = body;

        // Validación básica
        if (!amount || !currency || !orderId || !email) {
            return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 });
        }

        if (typeof amount !== "number" || amount <= 0) {
            return NextResponse.json({ error: "Monto inválido" }, { status: 400 });
        }

        if (currency !== "PEN" && currency !== "USD") {
            return NextResponse.json({ error: "Moneda no soportada" }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: "Email inválido" }, { status: 400 });
        }

        // Llama al servicio de Izipay
        // NOTA: Si no tienes credenciales reales configuradas, esto fallará o necesitas mockearlo.
        // Para efectos de esta demo sin credenciales, devolveremos un mock si falla.

        try {
            const result = await generateFormToken(amount, currency, orderId, email);
            if (result.status === "SUCCESS") {
                return NextResponse.json({ formToken: result.answer.formToken });
            } else {
                // Si falla (por ejemplo credenciales invalidas), retornamos un error o un mock para demo
                console.warn("Izipay devolvió error (esperado sin credenciales):", result);
                return NextResponse.json({
                    warning: "Credenciales inválidas, usando simulacion",
                    formToken: "DEMO-TOKEN-" + Math.random().toString(36).substring(7)
                });
            }
        } catch (e) {
            // Fallback para demo
            return NextResponse.json({
                warning: "Error de conexión, usando simulacion",
                formToken: "DEMO-TOKEN-" + Math.random().toString(36).substring(7)
            });
        }

    } catch (error) {
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
