export {};

declare global {
    interface Window {
        KR?: {
            setFormToken: (token: string) => void;
        };
    }
}
