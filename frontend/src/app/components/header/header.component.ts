import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BranchService } from '../../services/branch.service';
import { CartService } from '../../services/cart.service';
import { ReservationService } from '../../services/reservation.service';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  branchService = inject(BranchService);
  cartService = inject(CartService);
  reservationService = inject(ReservationService);
  menuService = inject(MenuService);

  isBranchDropdownOpen = false;
  isMobileMenuOpen = false;

  toggleBranchDropdown() {
    this.isBranchDropdownOpen = !this.isBranchDropdownOpen;
  }

  openBranchPrompt() {
    this.branchService.openBranchPrompt();
    this.isBranchDropdownOpen = false;
  }

  selectBranch(branch: any) {
    this.branchService.selectBranch(branch);
    this.menuService.loadMenu(branch.id).subscribe();
    this.isBranchDropdownOpen = false;
  }

  openReservation() {
    this.reservationService.openModal();
    this.isMobileMenuOpen = false;
  }

  openCallModal() {
    this.branchService.openCallModal();
    this.isMobileMenuOpen = false;
  }

  openCart() {
    this.cartService.openCart();
    this.isMobileMenuOpen = false;
  }

  scrollTo(sectionId: string) {
    this.isMobileMenuOpen = false;
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
