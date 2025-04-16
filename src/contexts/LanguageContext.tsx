import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// Importiamo i file di traduzione
import enTranslation from '../locales/en/common.json';
import itTranslation from '../locales/it/common.json';

// Definizione dei tipi per TypeScript
type TranslationsType = {
  [key: string]: any;
};

type Languages = 'en' | 'it';

type LanguageContextType = {
  language: Languages;
  translations: TranslationsType;
  changeLanguage: (language: Languages) => void;
  t: (key: string) => string;
};

// Dizionario delle traduzioni
const translations: Record<Languages, TranslationsType> = {
  en: enTranslation,
  it: itTranslation
};

// Creazione del contesto
export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Hook per utilizzare il contesto
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage deve essere utilizzato all\'interno di un LanguageProvider');
  }
  return context;
};

// Provider del contesto
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Determina la lingua del browser o usa l'inglese come fallback
  const getBrowserLanguage = (): Languages => {
    if (typeof window !== 'undefined') {
      const browserLang = navigator.language.split('-')[0];
      return browserLang === 'it' ? 'it' : 'en';
    }
    return 'en';
  };

  // Stato per la lingua corrente
  const [language, setLanguage] = useState<Languages>('en');
  const [currentTranslations, setCurrentTranslations] = useState<TranslationsType>(translations.en);

  // Carica la lingua iniziale all'avvio
  useEffect(() => {
    // Controlla se esiste una lingua salvata
    const savedLanguage = localStorage.getItem('language') as Languages;
    const initialLanguage = savedLanguage || getBrowserLanguage();
    
    setLanguage(initialLanguage);
    setCurrentTranslations(translations[initialLanguage]);
  }, []);

  // Funzione per cambiare lingua
  const changeLanguage = (newLanguage: Languages) => {
    setLanguage(newLanguage);
    setCurrentTranslations(translations[newLanguage]);
    localStorage.setItem('language', newLanguage);
    
    // Aggiorna l'attributo lang dell'HTML per accessibilità e SEO
    document.documentElement.lang = newLanguage;
  };

  // Funzione t() per recuperare le traduzioni
  const t = (key: string): string => {
    // Supporta chiavi annidate come "header.startNow"
    const keys = key.split('.');
    let value: any = currentTranslations;
    
    for (const k of keys) {
      if (value === undefined) return key;
      value = value[k];
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, translations: currentTranslations, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}; 