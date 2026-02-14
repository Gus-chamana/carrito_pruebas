"use client";

import { useEffect, useMemo, useState } from "react";

const KRYPTON_SCRIPT =
    "https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js";
const KRYPTON_CLASSIC_SCRIPT =
    "https://static.micuentaweb.pe/static/js/krypton-client/V4.0/ext/classic.js";
const KRYPTON_CLASSIC_CSS =
    "https://static.micuentaweb.pe/static/js/krypton-client/V4.0/ext/classic-reset.css";

let kryptonPromise: Promise<void> | null = null;

const loadScript = (src: string, attributes?: Record<string, string>) =>
    new Promise<void>((resolve, reject) => {
        const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
        if (existing) {
            if ((existing as HTMLScriptElement).dataset.loaded === "true") {
                resolve();
                return;
            }
            existing.addEventListener("load", () => resolve());
            existing.addEventListener("error", () => reject(new Error("Error cargando script")));
            return;
        }

        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        if (attributes) {
            Object.entries(attributes).forEach(([key, value]) => {
                script.setAttribute(key, value);
            });
        }
        script.addEventListener("load", () => {
            script.dataset.loaded = "true";
            resolve();
        });
        script.addEventListener("error", () => reject(new Error("Error cargando script")));
        document.body.appendChild(script);
    });

const loadStylesheet = (href: string) => {
    const existing = document.querySelector<HTMLLinkElement>(`link[href="${href}"]`);
    if (existing) {
        return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
};

const loadKrypton = async (publicKey: string, successUrl: string) => {
    if (!kryptonPromise) {
        kryptonPromise = (async () => {
            loadStylesheet(KRYPTON_CLASSIC_CSS);
            await loadScript(KRYPTON_SCRIPT, {
                "kr-public-key": publicKey,
                "kr-post-url-success": successUrl,
            });
            await loadScript(KRYPTON_CLASSIC_SCRIPT);
        })();
    }

    return kryptonPromise;
};

interface IzipayPaymentFormProps {
    formToken: string;
    publicKey: string;
    successUrl: string;
}

export function IzipayPaymentForm({
    formToken,
    publicKey,
    successUrl,
}: IzipayPaymentFormProps) {
    const [ready, setReady] = useState(false);

    const normalizedSuccessUrl = useMemo(() => {
        if (successUrl) {
            return successUrl;
        }

        if (typeof window !== "undefined") {
            return `${window.location.origin}/checkout/success`;
        }

        return "";
    }, [successUrl]);

    useEffect(() => {
        let active = true;

        const init = async () => {
            if (!publicKey) {
                return;
            }

            await loadKrypton(publicKey, normalizedSuccessUrl);
            if (!active) {
                return;
            }

            if (window.KR && formToken) {
                window.KR.setFormToken(formToken);
                setReady(true);
            }
        };

        init().catch(() => {
            if (active) {
                setReady(false);
            }
        });

        return () => {
            active = false;
        };
    }, [formToken, publicKey, normalizedSuccessUrl]);

    return (
        <div className="space-y-2">
            {!ready && (
                <p className="text-sm text-gray-500">
                    Cargando formulario seguro de pago...
                </p>
            )}
            <div className="kr-embedded">
                <div className="kr-payment-form">
                    <div className="kr-form-error"></div>
                    <div className="kr-pan"></div>
                    <div className="kr-expiry"></div>
                    <div className="kr-security-code"></div>
                    <button className="kr-payment-button"></button>
                </div>
            </div>
        </div>
    );
}
