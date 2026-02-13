import { Header } from "@/components/layout/Header";
import { ProductCard } from "@/components/shop/ProductCard";
import { Product } from "@/types/product";

const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Zapatillas Runner Pro",
    price: 299.90,
    description: "Zapatillas de alto rendimiento para correr en cualquier terreno.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "Reloj Inteligente",
    price: 150.00,
    description: "Monitorea tu salud y recibe notificaciones al instante.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Cámara DSLR",
    price: 1200.50,
    description: "Captura momentos inolvidables con la mejor calidad de imagen.",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              Nuestros Productos Destacados
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              Encuentra lo mejor en tecnología y moda con descuentos exclusivos.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
