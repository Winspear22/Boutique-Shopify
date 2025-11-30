import React from 'react';
import { useShopify } from '../context/ShopifyContext';
import { motion } from 'framer-motion';

export default function Shop({ setView }) {
  const { products, loading, addItemToCart, setIsCartOpen, cart } = useShopify();

  // Calcul du nombre d'articles
  const cartQuantity = cart?.lineItems?.reduce((total, item) => total + item.quantity, 0) || 0;

  if (loading) return <div className="min-h-screen bg-brand-black flex items-center justify-center text-white">Chargement...</div>;

  return (
    <section className="min-h-screen bg-brand-black pt-32 pb-20 px-6 relative z-20">
      
      {/* Header Boutique : Retour + Panier */}
      <div className="max-w-7xl mx-auto mb-10 flex justify-between items-center">
        <button onClick={() => setView('main')} className="text-gray-400 hover:text-white uppercase text-sm font-bold tracking-widest flex items-center gap-2 transition-colors">
            <span>←</span> Retour
        </button>

        {/* Bouton Panier */}
        <button 
            onClick={() => setIsCartOpen(true)}
            className="relative group flex items-center gap-2 text-white hover:text-brand-accent transition-colors"
        >
            <span className="text-sm font-bold uppercase tracking-widest hidden sm:block">Mon Panier</span>
            <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartQuantity > 0 && (
                    <span className="absolute -top-2 -right-2 bg-brand-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                        {cartQuantity}
                    </span>
                )}
            </div>
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter mb-16 text-center">
            La <span className="text-brand-accent">Boutique</span>
        </h1>

        {!products || products.length === 0 ? (
            <div className="text-center text-gray-500 text-xl border border-white/10 p-10 rounded-xl bg-white/5">
                <p className="mb-4">Aucun produit trouvé.</p>
                <p className="text-sm text-gray-400">
                    Vérifiez que vos produits sont en statut <strong>ACTIF</strong> sur Shopify.
                </p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
                <motion.div 
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="group bg-brand-gray/20 border border-white/5 rounded-2xl overflow-hidden hover:border-brand-accent/50 transition-all duration-300 flex flex-col"
                >
                    <div className="aspect-square bg-white/5 relative overflow-hidden">
                        {product.images && product.images[0] ? (
                            <img 
                                src={product.images[0].src} 
                                alt={product.title} 
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600 bg-gray-900">Pas d'image</div>
                        )}
                        
                        {!product.availableForSale && (
                            <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                                Épuisé
                            </div>
                        )}
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-white uppercase italic mb-2">{product.title}</h3>
                        <p className="text-gray-400 text-sm line-clamp-2 mb-6 h-10 flex-1">{product.description}</p>
                        
                        <div className="flex items-center justify-between mt-auto">
                            <span className="text-2xl font-black text-brand-accent">
                                {product.variants[0]?.price?.amount} {product.variants[0]?.price?.currencyCode}
                            </span>
                            
                            <button 
                                onClick={() => addItemToCart(product.variants[0].id)}
                                disabled={!product.availableForSale}
                                className={`px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-all
                                    ${product.availableForSale 
                                        ? 'bg-white text-black hover:bg-brand-accent hover:text-white' 
                                        : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                            >
                                {product.availableForSale ? 'Ajouter' : 'Indisponible'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            ))}
            </div>
        )}
      </div>
    </section>
  );
}