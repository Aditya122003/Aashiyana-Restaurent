import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../../services/reservation.service';
import { BranchService } from '../../services/branch.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent {
  reservationService = inject(ReservationService);
  branchService = inject(BranchService);
  cartService = inject(CartService);

  openReservation() {
    this.reservationService.openModal();
  }

  scrollToMenu() {
    const el = document.getElementById('dishes-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  openCallModal() {
    this.branchService.openCallModal();
  }
}
