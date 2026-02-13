"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

export function Header() {
    const { count } = useCart();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold text-blue-600">
                    Mi Tienda
                </Link>
                <nav className="flex items-center space-x-4">
                    <Link
                        href="/checkout"
                        className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative"
                    >
                        <ShoppingCart className="w-6 h-6" />
                        <span className="sr-only">Carrito</span>
                        {count > 0 && (
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                                {count}
                            </span>
                        )}
                    </Link>
                </nav>
            </div>
        </header>
    );
}
