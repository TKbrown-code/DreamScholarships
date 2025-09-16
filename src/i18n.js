import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
   en: {
    translation: {
      "aboutChina.title": "About China",
      "aboutChina.subtitle": "Discover the Land of Opportunities",
      "aboutChina.sectionTitle": "Why Study in China?",
      "aboutChina.paragraph1": "China is not just a country; it’s a gateway to the future...",
      "aboutChina.paragraph2": "Experience cutting-edge research, innovative teaching methods..."
    }
  },
  fr: { translation: { "header.title": "Bourse de Rêve", "header.apply": "Postuler", "header.contact": "Contact", "form.createAccount": "Créer un compte" } },
  zh: { translation: { "header.title": "梦想奖学金", "header.apply": "申请", "header.contact": "联系", "form.createAccount": "创建帐户" } },
  ar: { translation: { "header.title": "منحة الأحلام", "header.apply": "تقديم", "header.contact": "اتصل", "form.createAccount": "إنشاء حساب" } }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    detection: { order: ['localStorage','navigator'], caches: ['localStorage'] },
    interpolation: { escapeValue: false }
  });

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
});

export default i18n;