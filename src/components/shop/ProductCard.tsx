"use client";

import Image from "next/image";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();

    return (
        <div className="group relative border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="aspect-square relative bg-gray-100">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover object-center group-hover:opacity-90 transition-opacity"
                />
            </div>
            <div className="p-4 space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                    {product.description}
                </p>
                <div className="flex items-center justify-between pt-2">
                    <span className="text-xl font-bold text-gray-900">
                        S/ {product.price.toFixed(2)}
                    </span>
                    <Button size="sm" onClick={() => addToCart(product)}>
                        Agregar
                    </Button>
                </div>
            </div>
        </div>
    );
}
