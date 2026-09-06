import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../services/reservation.service';
import { BranchService } from '../../services/branch.service';
import { Reservation } from '../../models/restaurant.models';

@Component({
  selector: 'app-reservation-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservation-modal.component.html',
  styleUrls: ['./reservation-modal.component.css']
})
export class ReservationModalComponent {
  reservationService = inject(ReservationService);
  branchService = inject(BranchService);

  formData: Reservation = {
    branchId: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    date: '',
    timeSlot: '07:30 PM',
    guests: 2,
    seatingPreference: 'Window View with Mountain Scenic',
    specialRequests: ''
  };

  isSubmitting = false;
  errorMessage = '';
  confirmedBooking: Reservation | null = null;

  constructor() {
    // Automatically set default branch to whatever branch user selected on the site
    effect(() => {
      const branch = this.branchService.selectedBranch();
      if (branch) {
        this.formData.branchId = branch.id;
      }
    });

    // When modal opens, ensure branchId is synced with current selected branch
    effect(() => {
      if (this.reservationService.isModalOpen()) {
        const branch = this.branchService.selectedBranch();
        if (branch) {
          this.formData.branchId = branch.id;
        }
        if (!this.formData.date) {
          this.formData.date = this.reservationService.minDate();
        }
      }
    });
  }

  close() {
    this.reservationService.closeModal();
    this.confirmedBooking = null;
    this.errorMessage = '';
  }

  submitReservation() {
    if (!this.formData.branchId) {
      this.errorMessage = 'Please select a branch';
      return;
    }
    if (!this.formData.customerName || !this.formData.customerPhone) {
      this.errorMessage = 'Please enter your name and contact phone number';
      return;
    }
    if (!this.formData.date || !this.formData.timeSlot) {
      this.errorMessage = 'Please choose a reservation date and time slot';
      return;
    }

    // Double check 15 days restriction
    const min = this.reservationService.minDate();
    const max = this.reservationService.maxDate();
    if (this.formData.date < min || this.formData.date > max) {
      this.errorMessage = `Reservations are strictly permitted between today (${min}) and next 15 days (${max}).`;
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.reservationService.createReservation(this.formData).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (res.success) {
          this.confirmedBooking = res.reservation;
        } else {
          this.errorMessage = res.message || 'Could not complete reservation';
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Server error while booking. Please try again.';
      }
    });
  }

  shareOnWhatsApp() {
    if (!this.confirmedBooking) return;
    const branchPhone = '919696591167';

    const msg = `🍽️ *TABLE RESERVATION INQUIRY - ASHIANA SHIMLA*\n` +
      `Booking ID: ${this.confirmedBooking.id}\n` +
      `Name: ${this.confirmedBooking.customerName}\n` +
      `Phone: ${this.confirmedBooking.customerPhone}\n` +
      `Branch: ${this.confirmedBooking.branchName}\n` +
      `Date: ${this.confirmedBooking.date}\n` +
      `Time: ${this.confirmedBooking.timeSlot}\n` +
      `Guests: ${this.confirmedBooking.guests} Persons\n` +
      `Seating: ${this.confirmedBooking.seatingPreference}\n` +
      (this.confirmedBooking.specialRequests ? `Special Request: ${this.confirmedBooking.specialRequests}\n` : '') +
      `\n_Please confirm our table table availability!_`;

    window.open(`https://api.whatsapp.com/send?phone=${branchPhone}&text=${encodeURIComponent(msg)}`, '_blank');
  }
}
