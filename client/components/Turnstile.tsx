// app/components/Turnstile.tsx
'use client';

import { useEffect } from 'react';

declare global {
    interface Window {
        turnstile?: any;
    }
}

type Props = {
    onSuccess: (token: string) => void;
};

export default function Turnstile({ onSuccess }: Props) {
    useEffect(() => {
        if (!sessionStorage.getItem("verified")) {
            const loadScript = () => {
                if (window.turnstile) {
                    window.turnstile.render('#cf-turnstile', {
                        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!,
                        callback: (token: string) => {
                            onSuccess(token);
                        },
                    });
                }
            };

            const existingScript = document.querySelector('script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]');

            if (!existingScript) {
                const script = document.createElement('script');
                script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
                script.async = true;
                script.defer = true;
                script.onload = loadScript;
                document.body.appendChild(script);
            } else {
                loadScript(); // already loaded
            }
        }
    }, [onSuccess]);

    return <div id="cf-turnstile" />;
}
