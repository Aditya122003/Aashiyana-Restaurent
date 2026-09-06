import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { BranchService } from '../../services/branch.service';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart-drawer.component.html',
  styleUrls: ['./cart-drawer.component.css']
})
export class CartDrawerComponent {
  cartService = inject(CartService);
  branchService = inject(BranchService);

  customerName = '';
  customerPhone = '';
  orderType = 'Takeaway'; // 'Takeaway' | 'Delivery' | 'Dine-In'
  deliveryAddress = '';
  orderNotes = '';
  errorMessage = '';

  close() {
    this.cartService.closeCart();
  }

  submitWhatsAppOrder() {
    if (this.cartService.cartItems().length === 0) {
      this.errorMessage = 'Your cart is empty.';
      return;
    }

    if (!this.customerName.trim() || !this.customerPhone.trim()) {
      this.errorMessage = 'Please enter your Name and Mobile number so the branch can reach you.';
      return;
    }

    if (this.orderType === 'Delivery' && !this.deliveryAddress.trim()) {
      this.errorMessage = 'Please enter your delivery address in Shimla.';
      return;
    }

    this.errorMessage = '';
    const branch = this.branchService.selectedBranch() || this.branchService.branches()[0];

    this.cartService.sendWhatsAppOrder(branch, {
      name: this.customerName.trim(),
      phone: this.customerPhone.trim(),
      orderType: this.orderType,
      address: this.deliveryAddress.trim(),
      notes: this.orderNotes.trim()
    });
  }
}
