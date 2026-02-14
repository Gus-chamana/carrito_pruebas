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

        const result = await generateFormToken(amount, currency, orderId, email);
        if (result.status === "SUCCESS") {
            return NextResponse.json({ formToken: result.answer.formToken, orderId });
        }

        return NextResponse.json(
            { error: result.answer?.errorMessage || "No se pudo generar el formToken" },
            { status: 502 }
        );
    } catch (error) {
        console.error("Error iniciando pago Izipay:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
