import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'nl' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('nl');

  useEffect(() => {
    const saved = localStorage.getItem('language-preference');
    if (saved === 'en' || saved === 'nl') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language-preference', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguageStore = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguageStore must be used within a LanguageProvider');
  }
  return context;
};

export const translations = {
  nl: {
    // Navigation
    home: 'Home',
    products: 'Producten',
    ramenPreorder: 'Ramen Voorbestelling',
    ramenDetails: 'Ramen Details',
    admin: 'Admin',
    
    // Header
    tagline: 'Ambachtelijke siropen uit Groningen',
    
    // Hero Section
    heroTitle: 'Proef de zomer in elke druppel',
    heroSubtitle: 'Onze ambachtelijke siropen worden met liefde en zorg gemaakt van de beste lokale ingrediënten. Van vlierbloesem tot rozen - elke fles vertelt een verhaal van Groningen.',
    shopNow: 'Bestel Nu',
    learnMore: 'Meer Ontdekken',
    
    // Products
    featuredProducts: 'Uitgelichte Producten',
    addToCart: 'Toevoegen aan Winkelwagen',
    outOfStock: 'Uitverkocht',
    limitedStock: 'Beperkte Voorraad',
    moreDetails: 'Meer Details',
    stock: 'Voorraad',
    ingredients: 'Ingrediënten',
    nutrition: 'Voedingswaarden',
    usage: 'Gebruik',
    story: 'Verhaal',
    
    // Product Details
    elderflowerSyrup: 'Vlierbloesem Siroop',
    elderflowerDescription: 'Een verfrissende siroop gemaakt van handgeplukte vlierbloesem uit Groningen.',
    roseSyrup: 'Rozen Siroop',
    roseDescription: 'Delicate rozensiroop met een subtiele bloemensmaak.',
    ramenSet: 'Chicken Shoyu Ramen',
    ramenDescription: 'Authentieke Japanse ramen met kip en shoyu bouillon.',
    
    // Shopping Cart
    cart: 'Winkelwagen',
    cartEmpty: 'Je winkelwagen is leeg',
    continueShopping: 'Verder Winkelen',
    checkout: 'Afrekenen',
    total: 'Totaal',
    quantity: 'Aantal',
    remove: 'Verwijderen',
    
    // Contact
    contact: 'Contact',
    contactUs: 'Neem Contact Op',
    name: 'Naam',
    email: 'E-mail',
    message: 'Bericht',
    sendMessage: 'Verstuur Bericht',
    
    // Footer
    followUs: 'Volg Ons',
    address: 'Star Numanstraat, 9717JE Groningen',
    
    // Ramen
    ramenPreorderTitle: 'Ramen Voorbestelling',
    selectDate: 'Selecteer een datum',
    customerInfo: 'Klantgegevens',
    phone: 'Telefoon',
    notes: 'Opmerkingen',
    submitOrder: 'Bestelling Plaatsen',
    
    // Admin
    adminLogin: 'Admin Inloggen',
    username: 'Gebruikersnaam',
    password: 'Wachtwoord',
    login: 'Inloggen',
    logout: 'Uitloggen',
    dashboard: 'Dashboard',
    orders: 'Bestellingen',
    ramenOrders: 'Ramen Bestellingen',
    
    // Status
    pending: 'In behandeling',
    confirmed: 'Bevestigd',
    ready: 'Klaar',
    completed: 'Voltooid',
    cancelled: 'Geannuleerd',
    
    // Common
    loading: 'Laden...',
    error: 'Er is een fout opgetreden',
    success: 'Gelukt!',
    save: 'Opslaan',
    cancel: 'Annuleren',
    edit: 'Bewerken',
    delete: 'Verwijderen',
    confirm: 'Bevestigen',
  },
  en: {
    // Navigation
    home: 'Home',
    products: 'Products',
    ramenPreorder: 'Ramen Preorder',
    ramenDetails: 'Ramen Details',
    admin: 'Admin',
    
    // Header
    tagline: 'Artisanal syrups from Groningen',
    
    // Hero Section
    heroTitle: 'Taste summer in every drop',
    heroSubtitle: 'Our artisanal syrups are made with love and care from the finest local ingredients. From elderflower to roses - every bottle tells a story of Groningen.',
    shopNow: 'Shop Now',
    learnMore: 'Learn More',
    
    // Products
    featuredProducts: 'Featured Products',
    addToCart: 'Add to Cart',
    outOfStock: 'Out of Stock',
    limitedStock: 'Limited Stock',
    moreDetails: 'More Details',
    stock: 'Stock',
    ingredients: 'Ingredients',
    nutrition: 'Nutrition',
    usage: 'Usage',
    story: 'Story',
    
    // Product Details
    elderflowerSyrup: 'Elderflower Syrup',
    elderflowerDescription: 'A refreshing syrup made from hand-picked elderflower from Groningen.',
    roseSyrup: 'Rose Syrup',
    roseDescription: 'Delicate rose syrup with a subtle floral taste.',
    ramenSet: 'Chicken Shoyu Ramen',
    ramenDescription: 'Authentic Japanese ramen with chicken and shoyu broth.',
    
    // Shopping Cart
    cart: 'Cart',
    cartEmpty: 'Your cart is empty',
    continueShopping: 'Continue Shopping',
    checkout: 'Checkout',
    total: 'Total',
    quantity: 'Quantity',
    remove: 'Remove',
    
    // Contact
    contact: 'Contact',
    contactUs: 'Contact Us',
    name: 'Name',
    email: 'Email',
    message: 'Message',
    sendMessage: 'Send Message',
    
    // Footer
    followUs: 'Follow Us',
    address: 'Star Numanstraat, 9717JE Groningen',
    
    // Ramen
    ramenPreorderTitle: 'Ramen Preorder',
    selectDate: 'Select a date',
    customerInfo: 'Customer Information',
    phone: 'Phone',
    notes: 'Notes',
    submitOrder: 'Place Order',
    
    // Admin
    adminLogin: 'Admin Login',
    username: 'Username',
    password: 'Password',
    login: 'Login',
    logout: 'Logout',
    dashboard: 'Dashboard',
    orders: 'Orders',
    ramenOrders: 'Ramen Orders',
    
    // Status
    pending: 'Pending',
    confirmed: 'Confirmed',
    ready: 'Ready',
    completed: 'Completed',
    cancelled: 'Cancelled',
    
    // Common
    loading: 'Loading...',
    error: 'An error occurred',
    success: 'Success!',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    confirm: 'Confirm',
  }
};

export const useTranslation = () => {
  const { language } = useLanguageStore();
  
  const t = (key: keyof typeof translations.nl): string => {
    return translations[language][key] || key;
  };
  
  return { t, language };
};