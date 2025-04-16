import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { language, changeLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center space-x-2" role="group" aria-label="Selettore lingua">
      <button
        onClick={() => changeLanguage('it')}
        className={`px-2 py-1 rounded transition-colors ${
          language === 'it' 
            ? 'bg-blue-600 text-white font-bold' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
        }`}
        aria-label="Cambia lingua in italiano"
        title="Cambia lingua in italiano"
        aria-pressed={language === 'it'}
      >
        <span className="sr-only">Italiano</span>
        <span aria-hidden="true">IT</span>
      </button>
      <button
        onClick={() => changeLanguage('en')}
        className={`px-2 py-1 rounded transition-colors ${
          language === 'en' 
            ? 'bg-blue-600 text-white font-bold' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
        }`}
        aria-label="Change language to English"
        title="Change language to English"
        aria-pressed={language === 'en'}
      >
        <span className="sr-only">English</span>
        <span aria-hidden="true">EN</span>
      </button>
    </div>
  );
};

export default LanguageSwitcher; 