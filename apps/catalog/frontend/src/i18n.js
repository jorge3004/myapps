import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import es from './locales/es.json';

const resources = {
    en: { translation: en },
    es: { translation: es },
};



// Detectar idioma preferido del navegador si no hay lang en localStorage
let lang = localStorage.getItem('lang');
if (!lang) {
    const browserLang = navigator.language?.split('-')[0];
    if (browserLang && Object.keys(resources).includes(browserLang)) {
        lang = browserLang;
    } else {
        lang = 'en';
    }
    localStorage.setItem('lang', lang);
}

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: lang, // Usar el idioma detectado
        fallbackLng: 'en',
        interpolation: { escapeValue: false },
    });

export default i18n;
