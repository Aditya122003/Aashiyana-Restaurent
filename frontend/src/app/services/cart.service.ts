import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MenuItem, CartItem, Branch } from '../models/restaurant.models';
import { getApiBaseUrl } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private get apiUrl() {
    return getApiBaseUrl();
  }

  cartItems = signal<CartItem[]>([]);
  isCartOpen = signal<boolean>(false);

  // Computations
  totalItemsCount = computed(() => {
    return this.cartItems().reduce((sum, item) => sum + item.quantity, 0);
  });

  subtotal = computed(() => {
    return this.cartItems().reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  });

  constructor(private http: HttpClient) {
    this.loadCartFromStorage();
  }

  private loadCartFromStorage() {
    try {
      const saved = localStorage.getItem('ashiana_cart');
      if (saved) {
        this.cartItems.set(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error reading cart from localStorage', e);
    }
  }

  private saveCartToStorage() {
    try {
      localStorage.setItem('ashiana_cart', JSON.stringify(this.cartItems()));
    } catch (e) {
      console.error('Error saving cart to localStorage', e);
    }
  }

  openCart() {
    this.isCartOpen.set(true);
  }

  closeCart() {
    this.isCartOpen.set(false);
  }

  addToCart(item: MenuItem, quantity: number = 1) {
    const current = [...this.cartItems()];
    const price = item.currentPrice !== undefined ? item.currentPrice : item.defaultPrice;
    const existingIndex = current.findIndex(ci => ci.item.id === item.id);

    if (existingIndex > -1) {
      current[existingIndex].quantity += quantity;
      current[existingIndex].unitPrice = price; // update with latest price
    } else {
      current.push({
        item,
        quantity,
        unitPrice: price
      });
    }

    this.cartItems.set(current);
    this.saveCartToStorage();
  }

  updateQuantity(itemId: string, delta: number) {
    let current = [...this.cartItems()];
    const index = current.findIndex(ci => ci.item.id === itemId);
    if (index > -1) {
      const newQty = current[index].quantity + delta;
      if (newQty <= 0) {
        current.splice(index, 1);
      } else {
        current[index].quantity = newQty;
      }
      this.cartItems.set(current);
      this.saveCartToStorage();
    }
  }

  removeFromCart(itemId: string) {
    const current = this.cartItems().filter(ci => ci.item.id !== itemId);
    this.cartItems.set(current);
    this.saveCartToStorage();
  }

  clearCart() {
    this.cartItems.set([]);
    localStorage.removeItem('ashiana_cart');
  }

  getItemQuantity(itemId: string): number {
    const found = this.cartItems().find(ci => ci.item.id === itemId);
    return found ? found.quantity : 0;
  }

  sendWhatsAppOrder(
    branch: Branch,
    customerData: {
      name: string;
      phone: string;
      orderType: string; // 'Dine-In' | 'Takeaway' | 'Delivery'
      address?: string;
      notes?: string;
    }
  ) {
    const items = this.cartItems();
    if (items.length === 0) return;

    const total = this.subtotal();

    // 1. Construct message text
    let message = `🛎️ *NEW ORDER - ASHIANA SWEETS & RESTAURANT*\n`;
    message += `📍 *Branch:* ${branch.name}\n`;
    message += `👤 *Customer Name:* ${customerData.name}\n`;
    message += `📞 *Phone:* ${customerData.phone}\n`;
    message += `🏷️ *Order Type:* ${customerData.orderType}\n`;
    if (customerData.orderType === 'Delivery' && customerData.address) {
      message += `🏠 *Delivery Address:* ${customerData.address}\n`;
    }
    if (customerData.notes) {
      message += `📝 *Special Note:* ${customerData.notes}\n`;
    }
    message += `\n🛒 *ORDER ITEMS:*\n`;
    items.forEach((ci, idx) => {
      const itemTotal = ci.unitPrice * ci.quantity;
      message += `${idx + 1}. ${ci.item.name} (${ci.item.unit}) x ${ci.quantity} = ₹${itemTotal}\n`;
    });
    message += `\n💰 *TOTAL AMOUNT: ₹${total}*\n`;
    message += `\n_Thank you for ordering with Ashiana Foods Shimla! Please confirm preparation time._`;

    // 2. Log order to backend silently for superadmin tracking
    this.http.post(`${this.apiUrl}/orders/log`, {
      branchId: branch.id,
      branchName: branch.name,
      customerName: customerData.name,
      customerPhone: customerData.phone,
      orderType: customerData.orderType,
      deliveryAddress: customerData.address || '',
      items: items.map(i => ({
        id: i.item.id,
        name: i.item.name,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        subtotal: i.quantity * i.unitPrice
      })),
      totalAmount: total,
      notes: customerData.notes || ''
    }).subscribe({
      next: () => {},
      error: (err) => console.error('Order logging skipped:', err)
    });

    // 3. WhatsApp Redirect - Send to user specified official WhatsApp line 9696591167
    let targetPhone = '919696591167';

    const encodedText = encodeURIComponent(message);
    const waUrl = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodedText}`;
    
    // Open WhatsApp
    window.open(waUrl, '_blank');

    // Optionally clear cart or keep it
    this.clearCart();
    this.closeCart();
  }
}
