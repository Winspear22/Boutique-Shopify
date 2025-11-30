import React from 'react';
import { useShopify } from '../context/ShopifyContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Cart() {
  const { isCartOpen, setIsCartOpen, cart, removeLineItem, checkoutUrl } = useShopify();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Fond sombre (Overlay) */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
          />

          {/* Tiroir Panier */}
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-brand-black border-l border-white/10 z-[70] shadow-2xl flex flex-col"
          >
            {/* Header Panier */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-2xl font-black text-white uppercase italic">Votre Panier</h2>
                <button onClick={() => setIsCartOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-brand-accent transition-colors">✕</button>
            </div>

            {/* Liste des produits */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart?.lineItems.length === 0 ? (
                    <div className="text-center text-gray-500 mt-20">Votre panier est vide.</div>
                ) : (
                    cart?.lineItems.map((item) => (
                        <div key={item.id} className="flex gap-4">
                            <div className="w-20 h-20 bg-white/5 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                                <img src={item.variant.image.src} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white font-bold text-sm uppercase">{item.title}</h3>
                                <p className="text-gray-400 text-xs mb-2">{item.variant.title !== 'Default Title' ? item.variant.title : ''}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-brand-accent font-bold">{item.variant.price.amount} €</span>
                                    <button onClick={() => removeLineItem(item.id)} className="text-xs text-gray-500 hover:text-white underline">Retirer</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer Panier (Total + Checkout) */}
            {cart?.lineItems.length > 0 && (
                <div className="p-6 border-t border-white/10 bg-brand-gray/20">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-gray-400 uppercase tracking-widest text-xs">Total</span>
                        <span className="text-2xl font-black text-white">{cart?.totalPrice.amount} €</span>
                    </div>
                    <a 
                        href={checkoutUrl}
                        className="block w-full py-4 bg-white text-black font-black text-center uppercase tracking-widest hover:bg-brand-accent hover:text-white transition-all rounded-sm"
                    >
                        Paiement Sécurisé
                    </a>
                </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}