# Guía de Integración Izipay (Next.js)

Esta guía te explica paso a paso cómo configurar Izipay para realizar cobros en tu tienda.

## 1. Obtener Credenciales (Back Office)
Para procesar pagos, necesitas una cuenta en el Back Office de Izipay (Micuentaweb).

1.  Ingresa a tu Back Office (Test o Producción).
2.  Ve a **Configuración > Tienda > Claves de API**.
3.  Copia tu **identificador de tienda (Shop ID)**.
4.  Genera o copia tu **Clave de Test (Test Key)** y **Clave de Producción (Prod Key)**.

## 2. Configurar Variables de Entorno
Crea un archivo `.env.local` en la raíz de tu proyecto y agrega tus claves. **NUNCA subas este archivo a GitHub.**

```env
IZIPAY_SHOP_ID=87654321
IZIPAY_TEST_KEY=t_4eC...
IZIPAY_PROD_KEY=p_7aB...
IZIPAY_MODE=TEST
NEXT_PUBLIC_IZIPAY_PUBLIC_KEY=12345678:PUBLIC-TEST-KEY
NEXT_PUBLIC_IZIPAY_SUCCESS_URL=https://tu-dominio.com/checkout/success
```

## 3. Flujo de Pago (Cómo funciona el código)

### A. Backend (`src/app/api/payment/init/route.ts`)
Hemos creado una ruta de API que:
1.  Recibe el monto y datos del cliente desde el frontend.
2.  Se conecta a los servidores de Izipay usando tus credenciales.
3.  Solicita un `formToken`.
4.  Devuelve este token al frontend.

### B. Frontend (`src/app/checkout/page.tsx`)
1.  Cuando el usuario hace clic en "Pagar", llama a nuestra API.
2.  Con el `formToken` recibido, utiliza la librería JS de Izipay (`krypton-client`) para mostrar el formulario de pago (Pop-up o incrustado).

## 4. Probando Pagos (Modo Test)
1.  Asegúrate de que `IZIPAY_MODE=TEST` en tu `.env.local`.
2.  Usa las tarjetas de prueba de Izipay (disponibles en su documentación, usualmente inician con `4970...`).
3.  Verifica que la transacción aparezca en el Back Office de Test.

## 5. Pasar a Producción
1.  Cambia `IZIPAY_MODE=PRODUCTION` en `.env.local`.
2.  Asegúrate de que tu dominio tenga HTTPS (obligatorio).
3.  Realiza una compra real de monto bajo (ej. S/ 1.00) para verificar.
4.  Anula la transacción desde el Back Office si deseas reembolsar el dinero.

## Implementación Frontend (Siguientes Pasos)
Para completar la integración, se cargan los scripts de Izipay de forma dinámica en el checkout.

En el `HEAD` de tu documento document (o `layout.tsx`), agrega:
```html
<script 
  src="https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js"
  kr-public-key="TU_CLAVE_PUBLICA_DE_TEST_AQUI"
  kr-post-url-success="https://tu-dominio.com/checkout/success"
></script>
<link rel="stylesheet" href="https://static.micuentaweb.pe/static/js/krypton-client/V4.0/ext/classic-reset.css">
<script src="https://static.micuentaweb.pe/static/js/krypton-client/V4.0/ext/classic.js"></script>
```
*Nota: Reemplaza `TU_CLAVE_PUBLICA...` con la clave pública de tu Back Office y usa tu dominio real en `NEXT_PUBLIC_IZIPAY_SUCCESS_URL`.*
