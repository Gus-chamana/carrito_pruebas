interface IzipayConfig {
    shopId?: string;
    testKey?: string;
    prodKey?: string;
    mode: "TEST" | "PRODUCTION";
    apiUrl: string;
}

const config: IzipayConfig = {
    shopId: process.env.IZIPAY_SHOP_ID,
    testKey: process.env.IZIPAY_TEST_KEY,
    prodKey: process.env.IZIPAY_PROD_KEY,
    mode: (process.env.IZIPAY_MODE as "TEST" | "PRODUCTION") || "TEST",
    apiUrl: process.env.IZIPAY_API_URL || "https://api.micuentaweb.pe/api-payment/V4/Charge/CreatePayment",
};

const getAuthHeader = () => {
    if (!config.shopId) {
        throw new Error("IZIPAY_SHOP_ID no configurado");
    }

    const key = config.mode === "TEST" ? config.testKey : config.prodKey;
    if (!key) {
        throw new Error("Clave Izipay no configurada para el modo actual");
    }

    const auth = Buffer.from(`${config.shopId}:${key}`).toString("base64");
    return `Basic ${auth}`;
};

export const generateFormToken = async (
    amount: number,
    currency: string,
    orderId: string,
    email: string
) => {
    if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error("Monto invalido");
    }

    const payload = {
        amount: Math.round(amount * 100),
        currency,
        orderId,
        customer: {
            email,
        },
        transactionOptions: {
            mode: "INSTANT_PAYMENT",
        },
    };

    const response = await fetch(config.apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: getAuthHeader(),
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
        const message = data?.answer?.errorMessage || "Error solicitando formToken";
        const error = new Error(message);
        (error as Error & { detail?: unknown }).detail = data;
        throw error;
    }

    return data;
};
