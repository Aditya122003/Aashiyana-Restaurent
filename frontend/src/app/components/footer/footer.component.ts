import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BranchService } from '../../services/branch.service';
import { ReservationService } from '../../services/reservation.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  branchService = inject(BranchService);
  reservationService = inject(ReservationService);

  formatTel(phone: string): string {
    return 'tel:' + phone.replace(/[^0-9+]/g, '');
  }

  scrollTo(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  openReservation() {
    this.reservationService.openModal();
  }
}
