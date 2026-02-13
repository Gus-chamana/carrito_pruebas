import crypto from "crypto";

interface IzipayConfig {
    shopId: string;
    testKey: string;
    prodKey: string;
    mode: "TEST" | "PRODUCTION";
}

const config: IzipayConfig = {
    shopId: process.env.IZIPAY_SHOP_ID || "********",
    testKey: process.env.IZIPAY_TEST_KEY || "****************",
    prodKey: process.env.IZIPAY_PROD_KEY || "****************",
    mode: (process.env.IZIPAY_MODE as "TEST" | "PRODUCTION") || "TEST",
};

export const generateFormToken = async (amount: number, currency: string, orderId: string, email: string) => {
    // NOTA: Esta es una simplificación. En una implementación real, debes hacer una petición HTTP
    // a la API de Izipay (https://api.izipay.pe/api-payment/V4/Charge/CreatePayment)
    // autorizada con Basic Auth (usuario: shopId, contraseña: key).

    const key = config.mode === "TEST" ? config.testKey : config.prodKey;
    const auth = Buffer.from(`${config.shopId}:${key}`).toString("base64");

    const payload = {
        amount: Math.round(amount * 100), // Izipay usa centavos
        currency: currency,
        orderId: orderId,
        customer: {
            email: email,
        },
    };

    try {
        const response = await fetch("https://api.micuentaweb.pe/api-payment/V4/Charge/CreatePayment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${auth}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error generando token Izipay:", error);
        throw error;
    }
};
