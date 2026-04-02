'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './cart.module.css';

export default function CartPage() {
  const { items, totalItems, totalPrice, removeItem, updateQty, clearCart } = useCart();

  const gst = Math.round(totalPrice * 0.05);        // 5% GST
  const delivery = totalPrice > 0 ? 40 : 0;         // ₹40 delivery
  const grandTotal = totalPrice + gst + delivery;

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className={styles.main}>
          <div className={`container ${styles.empty}`}>
            <ShoppingBag size={72} strokeWidth={1} color="var(--amber)" />
            <h2 className={styles.emptyTitle}>Your cart is empty</h2>
            <p className={styles.emptyDesc}>Add some delicious items from our menu and come back!</p>
            <Link href="/#menu" className="btn-primary">Browse Menu →</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className="container">
          {/* Header */}
          <div className={styles.header}>
            <Link href="/#menu" className={styles.backLink}>
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
            <h1 className={styles.title}>Your Cart</h1>
            <button className={styles.clearBtn} onClick={clearCart}>Clear All</button>
          </div>

          <div className={styles.layout}>
            {/* Items */}
            <div className={styles.itemsList}>
              {items.map(item => {
                const isEmoji = !item.img.startsWith('/');
                return (
                  <div key={item.slug} className={styles.cartItem}>
                    {/* Image */}
                    <div className={styles.itemImg}>
                      {isEmoji ? (
                        <span className={styles.itemEmoji}>{item.img}</span>
                      ) : (
                        <Image src={item.img} alt={item.name} fill style={{ objectFit: 'cover' }} sizes="100px" />
                      )}
                    </div>

                    {/* Info */}
                    <div className={styles.itemInfo}>
                      <div className={styles.itemTop}>
                        <div>
                          <span className={styles.itemCat}>{item.category}</span>
                          <h3 className={styles.itemName}>
                            <Link href={`/menu/${item.slug}`}>{item.name}</Link>
                          </h3>
                          <p className={styles.itemDesc}>{item.desc}</p>
                        </div>
                        <button className={styles.removeBtn} onClick={() => removeItem(item.slug)} aria-label="Remove">
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className={styles.itemBottom}>
                        {/* Qty */}
                        <div className={styles.qtyControl}>
                          <button className={styles.qtyBtn} onClick={() => updateQty(item.slug, item.quantity - 1)}><Minus size={13} /></button>
                          <span className={styles.qtyVal}>{item.quantity}</span>
                          <button className={styles.qtyBtn} onClick={() => updateQty(item.slug, item.quantity + 1)}><Plus size={13} /></button>
                        </div>
                        <span className={styles.itemTotal}>₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <aside className={styles.summary}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>

              <div className={styles.summaryLines}>
                <div className={styles.summaryLine}>
                  <span>Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className={styles.summaryLine}>
                  <span>GST (5%)</span>
                  <span>₹{gst}</span>
                </div>
                <div className={styles.summaryLine}>
                  <span>Delivery Charges</span>
                  <span>₹{delivery}</span>
                </div>
                <div className={`${styles.summaryLine} ${styles.totalLine}`}>
                  <span>Grand Total</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>

              <div className={styles.savingNote}>
                🎉 You save ₹{Math.round(totalPrice * 0.1)} compared to dine-in prices!
              </div>

              <Link href="/checkout" className={styles.checkoutBtn}>
                Proceed to Checkout <ArrowRight size={16} />
              </Link>

              <div className={styles.paymentIcons}>
                <span>🔒 Secure Checkout</span>
                <div className={styles.payMethods}>
                  <span className={styles.payTag}>UPI</span>
                  <span className={styles.payTag}>Cards</span>
                  <span className={styles.payTag}>COD</span>
                  <span className={styles.payTag}>Wallets</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
