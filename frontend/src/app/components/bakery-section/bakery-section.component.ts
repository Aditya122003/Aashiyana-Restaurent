import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { MenuService } from '../../services/menu.service';
import { BranchService } from '../../services/branch.service';
import { ReservationService } from '../../services/reservation.service';

@Component({
  selector: 'app-bakery-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bakery-section.component.html',
  styleUrls: ['./bakery-section.component.css']
})
export class BakerySectionComponent {
  cartService = inject(CartService);
  menuService = inject(MenuService);
  branchService = inject(BranchService);
  reservationService = inject(ReservationService);

  orderCustomCakeWhatsApp() {
    const branch = this.branchService.selectedBranch();
    const branchName = branch ? branch.name : 'Chotta Shimla';
    const targetPhone = '919696591167';
    
    const message = `🎂 *Custom Cake / Bakery Inquiry - Ashiana Shimla*\n` +
      `Branch: ${branchName}\n` +
      `Hello Ashiana Team, I would like to inquire about a custom designer cake / sweet gift hampers. Please share the catalogue & flavors!`;
    
    window.open(`https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(message)}`, '_blank');
  }

  scrollToDishes(category: string) {
    this.menuService.selectedCategory.set(category);
    const el = document.getElementById('dishes-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
