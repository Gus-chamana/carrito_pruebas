"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";

export default function CheckoutSuccessPage() {
    const { clearCart } = useCart();

    useEffect(() => {
        clearCart();
    }, [clearCart]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-3xl font-bold text-gray-900">Pago exitoso</h1>
                <p className="mt-4 text-gray-600">
                    Tu pago fue procesado correctamente. Revisa tu correo para el comprobante.
                </p>
                <div className="mt-8">
                    <Link href="/">
                        <Button>Volver a la tienda</Button>
                    </Link>
                </div>
            </main>
        </div>
    );
}
