"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/layout/Header";
import Link from "next/link";
import Image from "next/image";

export default function CheckoutPage() {
    const { items, removeFromCart, total, clearCart } = useCart();

    const handlePayment = async () => {
        alert("Redirigiendo a pasarela de pagos (Simulación)...");
        // Aquí irá la integración con Izipay
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
                                <Button className="w-full" size="lg" onClick={handlePayment}>
                                    Proceder al Pago
                                </Button>
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
