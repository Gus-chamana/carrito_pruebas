"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/layout/Header";
import { IzipayPaymentForm } from "@/components/checkout/IzipayPaymentForm";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function CheckoutPage() {
    const { items, removeFromCart, total, clearCart } = useCart();
    const [email, setEmail] = useState("");
    const [formToken, setFormToken] = useState<string | null>(null);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const publicKey = process.env.NEXT_PUBLIC_IZIPAY_PUBLIC_KEY || "";
    const successUrl = process.env.NEXT_PUBLIC_IZIPAY_SUCCESS_URL || "";

    const handlePayment = async () => {
        if (!email) {
            setError("Ingresa un correo para continuar.");
            return;
        }

        if (!publicKey) {
            setError("Falta configurar la clave publica de Izipay.");
            return;
        }

        if (total <= 0) {
            setError("El total debe ser mayor a cero.");
            return;
        }

        setIsLoading(true);
        setError(null);

        const generatedOrderId = `ORDER-${Date.now()}`;
        setOrderId(generatedOrderId);

        try {
            const response = await fetch("/api/payment/init", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount: total,
                    currency: "PEN",
                    orderId: generatedOrderId,
                    email,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data?.error || "No se pudo iniciar el pago.");
                setFormToken(null);
                return;
            }

            setFormToken(data.formToken);
        } catch (err) {
            setError("No se pudo conectar con el servidor.");
            setFormToken(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-gray-900">Tu Carrito</h1>
                {items.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">Tu carrito está vacío.</p>
                        <Link href="/">
                            <Button>Volver a la tienda</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200"
                                >
                                    <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                                        <p className="text-sm text-gray-500">
                                            Cantidad: {item.quantity}
                                        </p>
                                        <p className="text-sm font-bold text-gray-900">
                                            S/ {item.price.toFixed(2)}
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                    >
                                        Eliminar
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24">
                                <h2 className="text-lg font-semibold mb-4 text-gray-900">Resumen de Orden</h2>
                                <div className="flex justify-between mb-4">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium text-gray-900">S/ {total.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-100 pt-4 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-lg font-bold text-gray-900">Total</span>
                                        <span className="text-lg font-bold text-blue-600">
                                            S/ {total.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    className="w-full"
                                    size="lg"
                                    onClick={handlePayment}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Cargando..." : "Generar Pago"}
                                </Button>
                                <div className="mt-4 space-y-2">
                                    <label className="text-sm text-gray-600" htmlFor="email">
                                        Correo para el comprobante
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        placeholder="cliente@email.com"
                                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900"
                                    />
                                </div>
                                {error && (
                                    <p className="mt-3 text-sm text-red-600">{error}</p>
                                )}
                                {orderId && (
                                    <p className="mt-3 text-xs text-gray-500">
                                        Orden: {orderId}
                                    </p>
                                )}
                                {formToken && (
                                    <div className="mt-6 rounded-md border border-gray-200 p-4">
                                        <IzipayPaymentForm
                                            formToken={formToken}
                                            publicKey={publicKey}
                                            successUrl={successUrl}
                                        />
                                    </div>
                                )}
                                <div className="mt-4 text-center">
                                    <Button variant="outline" size="sm" onClick={clearCart}>
                                        Vaciar Carrito
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
