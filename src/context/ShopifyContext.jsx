import React, { createContext, useState, useEffect, useContext } from 'react';
import client from '../shopifyClient';

const ShopifyContext = createContext();

export function ShopifyProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialisation : On charge les produits et on gère le panier persistant
  useEffect(() => {
    // 1. Charger les produits
    client.product.fetchAll()
      .then((fetchedProducts) => {
        setProducts(fetchedProducts);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur Shopify:", err);
        setLoading(false);
      });

    // 2. Gérer le panier (LocalStorage)
    const initializeCart = async () => {
        const existingCartId = localStorage.getItem('shopify_cart_id');

        if (existingCartId) {
            try {
                // On essaie de récupérer l'ancien panier
                const existingCart = await client.checkout.fetch(existingCartId);
                // Si le panier a été complété (payé), on en crée un nouveau
                if (existingCart.completedAt) {
                    createNewCart();
                } else {
                    setCart(existingCart);
                    setCheckoutUrl(existingCart.webUrl);
                }
            } catch (e) {
                // Si l'ID est invalide (expiré), on en crée un nouveau
                console.warn("Panier invalide, création d'un nouveau.");
                createNewCart();
            }
        } else {
            // Pas de panier, on en crée un
            createNewCart();
        }
    };

    initializeCart();
  }, []);

  const createNewCart = async () => {
      const checkout = await client.checkout.create();
      localStorage.setItem('shopify_cart_id', checkout.id);
      setCart(checkout);
      setCheckoutUrl(checkout.webUrl);
  };

  const addItemToCart = async (variantId, quantity = 1) => {
    if (!cart) return;
    setIsCartOpen(true);
    const lineItemsToAdd = [{ variantId, quantity }];
    const newCart = await client.checkout.addLineItems(cart.id, lineItemsToAdd);
    setCart(newCart);
  };

  const removeLineItem = async (lineItemId) => {
      const newCart = await client.checkout.removeLineItems(cart.id, [lineItemId]);
      setCart(newCart);
  };

  return (
    <ShopifyContext.Provider value={{ 
      cart, isCartOpen, setIsCartOpen, addItemToCart, removeLineItem, checkoutUrl, products, loading
    }}>
      {children}
    </ShopifyContext.Provider>
  );
}

export const useShopify = () => useContext(ShopifyContext);