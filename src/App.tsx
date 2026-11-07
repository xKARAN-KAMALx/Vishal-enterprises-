/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { PRODUCTS, HERO_BANNER_IMAGE } from './data/products';
import { Product, CartItem } from './types';
import { Header } from './components/Header';
import { CompactHero } from './components/CompactHero';
import { SlimCategoryBar } from './components/SlimCategoryBar';
import { ProductGrid2x2 } from './components/ProductGrid2x2';
import { ProductModal } from './components/ProductModal';
import { FloatingCartBar } from './components/FloatingCartBar';
import { CartDrawer } from './components/CartDrawer';
import { ExpandableFooter } from './components/ExpandableFooter';
import { SampleRequestModal } from './components/SampleRequestModal';
import { AdminModal } from './components/AdminModal';
import { OrderNowModal } from './components/OrderNowModal';
import { UserOrdersModal } from './components/UserOrdersModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

const CATEGORIES = [
  'All LED Products',
  'Finished LED Bulbs',
  'Inverter AC/DC Bulbs',
  'Raw Materials',
  'Drivers & MCPCBs',
  'COB & Panel Lights',
  'Flood & Street Lights',
];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All LED Products');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProductForSpecs, setSelectedProductForSpecs] = useState<Product | null>(null);

  // Modals state
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isOrderNowModalOpen, setIsOrderNowModalOpen] = useState<boolean>(false);
  const [isUserOrdersModalOpen, setIsUserOrdersModalOpen] = useState<boolean>(false);

  // Dynamic products list (Admin can add/delete)
  const [catalogProducts, setCatalogProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('vse_catalog_products');
      return saved ? JSON.parse(saved) : PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('vse_catalog_products', JSON.stringify(catalogProducts));
    } catch {
      // localStorage error fallback
    }
  }, [catalogProducts]);

  // Local storage cart persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('vse_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('vse_cart_items', JSON.stringify(cartItems));
    } catch {
      // Storage error fallback
    }
  }, [cartItems]);

  const getUnitPriceForQty = (product: Product, qty: number): number => {
    let price = product.basePrice;
    for (const tier of product.tiers) {
      if (qty >= tier.minQty) {
        if (!tier.maxQty || qty <= tier.maxQty) {
          price = tier.unitPrice;
          break;
        } else {
          price = tier.unitPrice;
        }
      }
    }
    return price;
  };

  const filteredProducts = useMemo(() => {
    return catalogProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All LED Products' || product.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.modelCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.specs.wattage.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [catalogProducts, selectedCategory, searchQuery]);

  const activeFilterCount =
    (selectedCategory !== 'All LED Products' ? 1 : 0) + (searchQuery.trim() !== '' ? 1 : 0);

  const handleResetFilters = () => {
    setSelectedCategory('All LED Products');
    setSearchQuery('');
  };

  const handleAddToCart = (product: Product, quantityToAdd: number) => {
    setCartItems((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + quantityToAdd;
        const unitPrice = getUnitPriceForQty(product, newQty);
        updated[existingIndex] = {
          product,
          quantity: newQty,
          calculatedUnitPrice: unitPrice,
          totalPrice: unitPrice * newQty,
        };
        return updated;
      } else {
        const unitPrice = getUnitPriceForQty(product, quantityToAdd);
        return [
          ...prevCart,
          {
            product,
            quantity: quantityToAdd,
            calculatedUnitPrice: unitPrice,
            totalPrice: unitPrice * quantityToAdd,
          },
        ];
      }
    });
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    setCartItems((prevCart) =>
      prevCart.map((item) => {
        if (item.product.id === productId) {
          const unitPrice = getUnitPriceForQty(item.product, newQuantity);
          return {
            ...item,
            quantity: newQuantity,
            calculatedUnitPrice: unitPrice,
            totalPrice: unitPrice * newQuantity,
          };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative">
      {/* Dark Background Image Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <img
          src={HERO_BANNER_IMAGE}
          alt="VS Enterprises Factory Atmosphere"
          className="w-full h-full object-cover opacity-15 filter blur-xs"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-950/90 to-slate-950" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* 1. Header with Admin Access & User Account Button */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenSampleModal={() => setIsSampleModalOpen(true)}
          onOpenAdminModal={() => setIsAdminModalOpen(true)}
          onOpenUserOrdersModal={() => setIsUserOrdersModalOpen(true)}
        />

        {/* 2. Hero Section */}
        <CompactHero onOpenSampleModal={() => setIsSampleModalOpen(true)} />

        {/* 3. Category Bar */}
        <SlimCategoryBar
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          totalProductsCount={filteredProducts.length}
          activeFilterCount={activeFilterCount}
          onResetFilters={handleResetFilters}
        />

        {/* 4. Products Viewport Section (Clean 2x2 Grid with White Product Cards) */}
        <main className="flex-1 pb-8">
          <ProductGrid2x2
            products={filteredProducts}
            onOpenSpecs={(product) => setSelectedProductForSpecs(product)}
            onAddToCart={handleAddToCart}
          />
        </main>

        {/* 5. Floating Cart Summary Bar */}
        <FloatingCartBar
          cartItems={cartItems}
          onOpenCartDrawer={() => setIsCartDrawerOpen(true)}
          onClearCart={handleClearCart}
        />

        {/* 6. Expandable Sticky Footer */}
        <ExpandableFooter onOpenSampleModal={() => setIsSampleModalOpen(true)} />

        {/* Floating WhatsApp Contact Button */}
        <FloatingWhatsApp />

        {/* Modals & Drawers */}
        <ProductModal
          product={selectedProductForSpecs}
          onClose={() => setSelectedProductForSpecs(null)}
          onAddToCart={handleAddToCart}
        />

        <CartDrawer
          isOpen={isCartDrawerOpen}
          onClose={() => setIsCartDrawerOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          onOpenOrderNowModal={() => setIsOrderNowModalOpen(true)}
        />

        <SampleRequestModal
          isOpen={isSampleModalOpen}
          onClose={() => setIsSampleModalOpen(false)}
        />

        <AdminModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          catalogProducts={catalogProducts}
          onUpdateProducts={setCatalogProducts}
        />

        <OrderNowModal
          isOpen={isOrderNowModalOpen}
          onClose={() => setIsOrderNowModalOpen(false)}
          cartItems={cartItems}
          onOrderSuccess={() => {
            handleClearCart();
          }}
        />

        <UserOrdersModal
          isOpen={isUserOrdersModalOpen}
          onClose={() => setIsUserOrdersModalOpen(false)}
        />
      </div>
    </div>
  );
}
