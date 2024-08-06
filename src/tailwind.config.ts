import type {Config} from "tailwindcss";
import {nextui} from '@nextui-org/theme'

const config: Config = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Poppins", "sans-serif"],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            colors: {
                primary: {
                    DEFAULT: "hsl(var(--colors-base-primary))",
                    foreground: "hsl(var(--colors-base-primary-foreground))",
                    "100": "hsl(var(--colors-base-primary-100))",
                    "200": "hsl(var(--colors-base-primary-200))",
                    "300": "hsl(var(--colors-base-primary-300))",
                    "400": "hsl(var(--colors-base-primary-400))",
                    "500": "hsl(var(--colors-base-primary-500))",
                    "600": "hsl(var(--colors-base-primary-600))",
                    "700": "hsl(var(--colors-base-primary-700))",
                    "800": "hsl(var(--colors-base-primary-800))",
                    "900": "hsl(var(--colors-base-primary-900))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--colors-base-secondary))",
                    foreground: "hsl(var(--colors-base-secondary-foreground))",
                    "100": "hsl(var(--colors-base-secondary-100))",
                    "200": "hsl(var(--colors-base-secondary-200))",
                    "300": "hsl(var(--colors-base-secondary-300))",
                    "400": "hsl(var(--colors-base-secondary-400))",
                    "500": "hsl(var(--colors-base-secondary-500))",
                    "600": "hsl(var(--colors-base-secondary-600))",
                    "700": "hsl(var(--colors-base-secondary-700))",
                    "800": "hsl(var(--colors-base-secondary-800))",
                    "900": "hsl(var(--colors-base-secondary-900))",
                },
                success: {
                    DEFAULT: "hsl(var(--colors-base-success))",
                    foreground: "hsl(var(--colors-base-success-foreground))",
                    "100": "hsl(var(--colors-base-success-100))",
                    "200": "hsl(var(--colors-base-success-200))",
                    "300": "hsl(var(--colors-base-success-300))",
                    "400": "hsl(var(--colors-base-success-400))",
                    "500": "hsl(var(--colors-base-success-500))",
                    "600": "hsl(var(--colors-base-success-600))",
                    "700": "hsl(var(--colors-base-success-700))",
                    "800": "hsl(var(--colors-base-success-800))",
                    "900": "hsl(var(--colors-base-success-900))",
                },
                warning: {
                    DEFAULT: "hsl(var(--colors-base-warning))",
                    foreground: "hsl(var(--colors-base-warning-foreground))",
                    "100": "hsl(var(--colors-base-warning-100))",
                    "200": "hsl(var(--colors-base-warning-200))",
                    "300": "hsl(var(--colors-base-warning-300))",
                    "400": "hsl(var(--colors-base-warning-400))",
                    "500": "hsl(var(--colors-base-warning-500))",
                    "600": "hsl(var(--colors-base-warning-600))",
                    "700": "hsl(var(--colors-base-warning-700))",
                    "800": "hsl(var(--colors-base-warning-800))",
                    "900": "hsl(var(--colors-base-warning-900))",
                },
                danger: {
                    DEFAULT: "hsl(var(--colors-base-danger))",
                    foreground: "hsl(var(--colors-base-danger-foreground))",
                    "100": "hsl(var(--colors-base-danger-100))",
                    "200": "hsl(var(--colors-base-danger-200))",
                    "300": "hsl(var(--colors-base-danger-300))",
                    "400": "hsl(var(--colors-base-danger-400))",
                    "500": "hsl(var(--colors-base-danger-500))",
                    "600": "hsl(var(--colors-base-danger-600))",
                    "700": "hsl(var(--colors-base-danger-700))",
                    "800": "hsl(var(--colors-base-danger-800))",
                    "900": "hsl(var(--colors-base-danger-900))",
                },
                layout : {
                    background: {
                        DEFAULT : "hsl(var(--colors-layout-background))",
                    },
                    foreground: {
                        DEFAULT : "hsl(var(--colors-layout-foreground))",
                        "50" : "hsl(var(--colors-layout-foreground-50))",
                        "100" : "hsl(var(--colors-layout-foreground-100))",
                        "200" : "hsl(var(--colors-layout-foreground-200))",
                        "300" : "hsl(var(--colors-layout-foreground-300))",
                        "400" : "hsl(var(--colors-layout-foreground-400))",
                        "500" : "hsl(var(--colors-layout-foreground-500))",
                        "600" : "hsl(var(--colors-layout-foreground-600))",
                        "700" : "hsl(var(--colors-layout-foreground-700))",
                        "800" : "hsl(var(--colors-layout-foreground-800))",
                        "900" : "hsl(var(--colors-layout-foreground-900))",
                    },
                    "overlay" : {
                        DEFAULT : "hsl(var(--colors-layout-overlay))",
                    },
                    "divider" : {
                        DEFAULT : "hsl(var(--colors-layout-divider))",
                    },
                },
                content: {
                    "content1" : "hsl(var(--colors-content-content1))",
                    "content2" : "hsl(var(--colors-content-content2))",
                    "content3" : "hsl(var(--colors-content-content3))",
                    "content4" : "hsl(var(--colors-content-content4))",
                    "content1-forground" : "hsl(var(--colors-content-content1-forground))",
                    "content2-forground" : "hsl(var(--colors-content-content2-forground))",
                    "content3-forground" : "hsl(var(--colors-content-content3-forground))",
                    "content4-forground" : "hsl(var(--colors-content-content4-forground))",
                }
            }
        },
    },
    plugins: [nextui({
        addCommonColors: true,
        prefix: 'colors-common',
    })],
};
export default config;
