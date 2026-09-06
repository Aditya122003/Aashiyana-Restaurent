import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { BranchService } from '../../services/branch.service';

@Component({
  selector: 'app-floating-cart-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './floating-cart-bar.component.html',
  styleUrls: ['./floating-cart-bar.component.css']
})
export class FloatingCartBarComponent {
  cartService = inject(CartService);
  branchService = inject(BranchService);

  openCart() {
    this.cartService.openCart();
  }
}
