import React, { useState } from 'react';

export default function LanguageModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('language');
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState('MXN');

  if (!isOpen) return null;

  const suggestedLanguages = [
    { lang: 'Español', region: 'Latinoamérica' },
    { lang: 'Español', region: 'España' },
    { lang: 'English', region: 'United States' },
    { lang: 'English', region: 'United Kingdom' },
    { lang: 'English', region: 'Australia' }
  ];

  const allLanguages = [
    { lang: 'Español', region: 'México', selected: true },
    { lang: 'Azərbaycan dili', region: 'Azərbaycan' },
    { lang: 'Bahasa Indonesia', region: 'Indonesia' },
    { lang: 'Bosanski', region: 'Bosna i Hercegovina' },
    { lang: 'Català', region: 'Espanya' },
    { lang: 'Čeština', region: 'Česká republika' },
    { lang: 'Crnogorski', region: 'Crna Gora' },
    { lang: 'Dansk', region: 'Danmark' },
    { lang: 'Deutsch', region: 'Deutschland' },
    { lang: 'Deutsch', region: 'Österreich' },
    { lang: 'Deutsch', region: 'Schweiz' },
    { lang: 'Deutsch', region: 'Luxemburg' },
    { lang: 'Eesti', region: 'Eesti' },
    { lang: 'English', region: 'Canada' },
    { lang: 'English', region: 'Guyana' },
    { lang: 'English', region: 'India' },
    { lang: 'English', region: 'Ireland' },
    { lang: 'English', region: 'New Zealand' },
    { lang: 'English', region: 'Singapore' },
    { lang: 'English', region: 'United Arab Emirates' },
    { lang: 'Español', region: 'Argentina' },
    { lang: 'Español', region: 'Belize' },
    { lang: 'Español', region: 'Bolivia' },
    { lang: 'Español', region: 'Chile' },
    { lang: 'Español', region: 'Colombia' },
    { lang: 'Español', region: 'Costa Rica' },
    { lang: 'Español', region: 'Ecuador' },
    { lang: 'Español', region: 'El Salvador' },
    { lang: 'Español', region: 'Estados Unidos' },
    { lang: 'Español', region: 'Guatemala' },
    { lang: 'Español', region: 'Honduras' },
    { lang: 'Español', region: 'Nicaragua' },
    { lang: 'Español', region: 'Panamá' },
    { lang: 'Español', region: 'Paraguay' },
    { lang: 'Español', region: 'Perú' },
    { lang: 'Español', region: 'Venezuela' },
    { lang: 'Français', region: 'Belgique' },
    { lang: 'Français', region: 'Canada' },
    { lang: 'Français', region: 'France' },
    { lang: 'Français', region: 'Suisse' },
    { lang: 'Français', region: 'Luxembourg' },
    { lang: 'Gaeilge', region: 'Éire' },
    { lang: 'Hrvatski', region: 'Hrvatska' },
    { lang: 'isiXhosa', region: 'eMzantsi Afrika' },
    { lang: 'isiZulu', region: 'iNingizimu Afrika' },
    { lang: 'Íslenska', region: 'Ísland' },
    { lang: 'Italiano', region: 'Italia' },
    { lang: 'Italiano', region: 'Svizzera' },
    { lang: 'Kiswahili', region: 'Afrika' },
    { lang: 'Latviešu', region: 'Latvija' },
    { lang: 'Lietuvių', region: 'Lietuva' },
    { lang: 'Magyar', region: 'Magyarország' },
    { lang: 'Malti', region: 'Malta' },
    { lang: 'Melayu', region: 'Malaysia' },
    { lang: 'Vlaams', region: 'België' },
    { lang: 'Nederlands', region: 'Nederland' },
    { lang: 'Norsk', region: 'Norge' },
    { lang: 'Polski', region: 'Polska' },
    { lang: 'Português', region: 'Brasil' },
    { lang: 'Português', region: 'Portugal' },
    { lang: 'Română', region: 'România' },
    { lang: 'Shqip', region: 'Shqipëri' },
    { lang: 'Slovenčina', region: 'Slovensko' },
    { lang: 'Slovenščina', region: 'Slovenija' },
    { lang: 'Srpski', region: 'Srbija' },
    { lang: 'Suomi', region: 'Suomi' },
    { lang: 'Svenska', region: 'Sverige' },
    { lang: 'Tagalog', region: 'Pilipinas' },
    { lang: 'Tiếng Việt', region: 'Việt Nam' },
    { lang: 'Türkçe', region: 'Türkiye' },
    { lang: 'Ελληνικά', region: 'Ελλάδα' },
    { lang: 'Български', region: 'България' },
    { lang: 'Македонски', region: 'Северна Македонија' },
    { lang: 'Русский', region: 'Россия' },
    { lang: 'Українська', region: 'Україна' },
    { lang: 'ქართული', region: 'საქართველო' },
    { lang: 'Հայերեն', region: 'Հայաստան' },
    { lang: 'עברית', region: 'ישראל' },
    { lang: 'العربية', region: 'العالم' },
    { lang: 'हिन्दी', region: 'भारत' },
    { lang: 'ಕನ್ನಡ', region: 'ಭಾರತ' },
    { lang: 'मराठी', region: 'भारत' },
    { lang: 'ไทย', region: 'ประเทศไทย' },
    { lang: '한국어', region: '대한민국' },
    { lang: '日本語', region: '日本' },
    { lang: '简体中文', region: '美国' },
    { lang: '繁體中文', region: '美国' },
    { lang: '简体中文', region: '中国' },
    { lang: '繁體中文', region: '香港' },
    { lang: '繁體中文', region: '台灣' }
  ];

  const currencies = [
    { code: 'MXN', name: 'Peso mexicano', symbol: '$' },
    { code: 'THB', name: 'Baht tailandés', symbol: '฿' },
    { code: 'GHS', name: 'Cedi ghanés', symbol: 'GH₵' },
    { code: 'KES', name: 'Chelín keniano', symbol: 'KSh' },
    { code: 'UGX', name: 'Chelín ugandés', symbol: 'USh' },
    { code: 'CRC', name: 'Colón costarricense', symbol: '₡' },
    { code: 'CZK', name: 'Corona checa', symbol: 'Kč' },
    { code: 'DKK', name: 'Corona danesa', symbol: 'kr' },
    { code: 'NOK', name: 'Corona noruega', symbol: 'kr' },
    { code: 'SEK', name: 'Corona sueca', symbol: 'kr' },
    { code: 'AED', name: 'Dirham de los Emiratos', symbol: 'د.إ' },
    { code: 'MAD', name: 'Dirham marroquí', symbol: 'MAD' },
    { code: 'AUD', name: 'Dólar australiano', symbol: '$' },
    { code: 'CAD', name: 'Dólar canadiense', symbol: '$' },
    { code: 'HKD', name: 'Dólar de Hong Kong', symbol: '$' },
    { code: 'SGD', name: 'Dólar de Singapur', symbol: '$' },
    { code: 'USD', name: 'Dólar estadounidense', symbol: '$' },
    { code: 'NZD', name: 'Dólar neozelandés', symbol: '$' },
    { code: 'VND', name: 'Dong vietnamita', symbol: '₫' },
    { code: 'PLN', name: 'Esloti polaco', symbol: 'zł' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'HUF', name: 'Forinto húngaro', symbol: 'Ft' },
    { code: 'CHF', name: 'Franco suizo', symbol: 'CHF' },
    { code: 'UAH', name: 'Grivna ucraniana', symbol: '₴' },
    { code: 'RON', name: 'Leu rumano', symbol: 'lei' },
    { code: 'BGN', name: 'Lev búlgaro', symbol: 'лв.' },
    { code: 'EGP', name: 'Libra egipcia', symbol: 'ج.م' },
    { code: 'GBP', name: 'Libra esterlina', symbol: '£' },
    { code: 'TRY', name: 'Lira turca', symbol: '₺' },
    { code: 'TWD', name: 'Nuevo dólar taiwanés', symbol: '$' },
    { code: 'CLP', name: 'Peso chileno', symbol: '$' },
    { code: 'COP', name: 'Peso colombiano', symbol: '$' },
    { code: 'PHP', name: 'Peso filipino', symbol: '₱' },
    { code: 'UYU', name: 'Peso uruguayo', symbol: '$U' },
    { code: 'ZAR', name: 'Rand sudafricano', symbol: 'R' },
    { code: 'BRL', name: 'Real brasileño', symbol: 'R$' },
    { code: 'QAR', name: 'Rial catarí', symbol: 'ر.ق' },
    { code: 'MYR', name: 'Ringgit malayo', symbol: 'RM' },
    { code: 'SAR', name: 'Riyal saudí', symbol: 'SR' },
    { code: 'INR', name: 'Rupia india', symbol: '₹' },
    { code: 'IDR', name: 'Rupia indonesia', symbol: 'Rp' },
    { code: 'ILS', name: 'Séquel israelí', symbol: '₪' },
    { code: 'PEN', name: 'Sol peruano', symbol: 'S/' },
    { code: 'KZT', name: 'Tengue kazajo', symbol: '₸' },
    { code: 'KRW', name: 'Won surcoreano', symbol: '₩' },
    { code: 'JPY', name: 'Yen japonés', symbol: '¥' },
    { code: 'CNY', name: 'Yuan chino', symbol: '¥' }
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-[920px] max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-5 flex items-center">
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-200">
            <div className="flex gap-6">
              <button
                onClick={() => setActiveTab('language')}
                className={`pb-3 text-base font-medium transition-colors ${
                  activeTab === 'language'
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Idioma y región
              </button>
              <button
                onClick={() => setActiveTab('currency')}
                className={`pb-3 text-base font-medium transition-colors ${
                  activeTab === 'currency'
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Divisa
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-1 px-6 py-6">
            {activeTab === 'language' ? (
              <>
                {/* Traducción automática */}
                <div className="mb-8 flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Traducción</p>
                      <p className="text-sm text-gray-600">Traduce automáticamente las descripciones y las evaluaciones al Español.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setAutoTranslate(!autoTranslate)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      autoTranslate ? 'bg-gray-900' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        autoTranslate ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Idiomas sugeridos */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Idiomas y regiones sugeridos</h3>
                  <div className="grid grid-cols-5 gap-3">
                    {suggestedLanguages.map((item, idx) => (
                      <button
                        key={idx}
                        className="p-4 text-left border border-gray-300 rounded-xl hover:border-gray-900 transition-colors"
                      >
                        <p className="font-medium text-gray-900 text-sm">{item.lang}</p>
                        <p className="text-xs text-gray-500">{item.region}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Todos los idiomas */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Elige un idioma y una región</h3>
                  <div className="grid grid-cols-5 gap-3">
                    {allLanguages.map((item, idx) => (
                      <button
                        key={idx}
                        className={`p-4 text-left border rounded-xl transition-colors ${
                          item.selected
                            ? 'border-gray-900 bg-gray-50'
                            : 'border-gray-300 hover:border-gray-900'
                        }`}
                      >
                        <p className="font-medium text-gray-900 text-sm">{item.lang}</p>
                        <p className="text-xs text-gray-500">{item.region}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Divisa */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Selecciona una moneda</h3>
                  <div className="grid grid-cols-5 gap-3">
                    {currencies.map((currency) => (
                      <button
                        key={currency.code}
                        onClick={() => setSelectedCurrency(currency.code)}
                        className={`p-4 text-left border rounded-xl transition-colors ${
                          selectedCurrency === currency.code
                            ? 'border-gray-900 bg-gray-50'
                            : 'border-gray-300 hover:border-gray-900'
                        }`}
                      >
                        <p className="font-medium text-gray-900 text-sm">{currency.name}</p>
                        <p className="text-xs text-gray-500">{currency.code} – {currency.symbol}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}