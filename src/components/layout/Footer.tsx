export function Footer() {
    return (
        <footer className="w-full border-t border-gray-200 bg-white py-6 mt-auto">
            <div className="container mx-auto px-4 text-center text-sm text-gray-600">
                <p>
                    &copy; {new Date().getFullYear() === 2026 ? "2026" : "2026"} Tienda Nextdev. Todos los derechos reservados.
                </p>
                <div className="mt-2 space-x-4">
                    <span className="hover:text-blue-600 cursor-pointer transition-colors">Términos y Condiciones</span>
                    <span className="hover:text-blue-600 cursor-pointer transition-colors">Política de Privacidad</span>
                </div>
            </div>
        </footer>
    );
}
