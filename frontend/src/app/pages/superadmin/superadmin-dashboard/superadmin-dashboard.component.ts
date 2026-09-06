import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { BranchService } from '../../../services/branch.service';
import { MenuService } from '../../../services/menu.service';
import { ReservationService } from '../../../services/reservation.service';
import { MenuItem, Branch, Reservation } from '../../../models/restaurant.models';

@Component({
  selector: 'app-superadmin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './superadmin-dashboard.component.html',
  styleUrls: ['./superadmin-dashboard.component.css']
})
export class SuperAdminDashboardComponent implements OnInit {
  authService = inject(AuthService);
  branchService = inject(BranchService);
  menuService = inject(MenuService);
  reservationService = inject(ReservationService);

  activeTab: 'branch-menu' | 'today-reservations' | 'calendar-reports' | 'all-reservations' | 'whatsapp-orders' | 'branches-info' = 'branch-menu';

  // Branch Menu Management - Default to Sanjaulli as requested
  selectedBranchId = 'sanjaulli-main-bazaar';
  branchPriceInputs: { [itemId: string]: { price: number; available: boolean; image: string } } = {};
  branchDishesList: MenuItem[] = [];
  
  // Dish Edit/Add Modal
  isDishModalOpen = false;
  editingDish: MenuItem | null = null;
  dishForm: {
    id?: string;
    name: string;
    category: string;
    description: string;
    price: number;
    unit: string;
    isVeg: boolean;
    isPopular: boolean;
    image: string;
    available: boolean;
  } = this.resetDishForm();

  // Today's Reservations
  todayReservations: Reservation[] = [];
  todayFilterBranch = 'all';

  // All Reservations
  allReservations: Reservation[] = [];
  reservationFilterBranch = 'all';

  // WhatsApp Orders
  ordersList: any[] = [];

  // Calendar Reports Tab
  reportDate = this.getTodayYMD();
  reportBranch = 'all';
  reportOrders: any[] = [];
  reportReservations: Reservation[] = [];

  // Feedback Toast
  feedbackToast = '';

  ngOnInit() {
    this.refreshAll();
  }

  getTodayYMD(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getYesterdayYMD(): string {
    const d = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  refreshAll() {
    this.branchService.loadBranches().subscribe({
      next: (res) => {
        if (!this.selectedBranchId && res?.branches?.length > 0) {
          this.selectedBranchId = 'sanjaulli-main-bazaar';
        }
        this.syncBranchDishes();
      },
      error: (err) => console.error('Failed to load branches:', err)
    });

    this.menuService.loadMenu().subscribe({
      next: () => {
        this.syncBranchDishes();
      },
      error: (err) => console.error('Failed to load menu:', err)
    });

    this.loadTodayReservations();
    this.loadAllReservations();
    this.loadOrders();
    this.loadReportData();
  }

  setTab(tab: 'branch-menu' | 'today-reservations' | 'calendar-reports' | 'all-reservations' | 'whatsapp-orders' | 'branches-info') {
    this.activeTab = tab;
    if (tab === 'today-reservations') this.loadTodayReservations();
    if (tab === 'calendar-reports') this.loadReportData();
    if (tab === 'all-reservations') this.loadAllReservations();
    if (tab === 'whatsapp-orders') this.loadOrders();
    if (tab === 'branch-menu') this.syncBranchDishes();
  }

  showToast(msg: string) {
    this.feedbackToast = msg;
    setTimeout(() => {
      this.feedbackToast = '';
    }, 4000);
  }

  // ================= BRANCH MENU & IMAGE CRUD =================
  onBranchSelectChange() {
    this.syncBranchDishes();
  }

  syncBranchDishes() {
    const branchId = this.selectedBranchId;
    const items = this.menuService.menuItems();
    this.branchPriceInputs = {};

    this.branchDishesList = items.map(item => {
      const override = item.branchPricing && item.branchPricing[branchId];
      const price = override && override.price !== undefined ? override.price : item.defaultPrice;
      const available = override && override.available !== undefined ? override.available : true;
      const image = (override && override.image) ? override.image : item.image;

      this.branchPriceInputs[item.id] = { price, available, image };

      return {
        ...item,
        currentPrice: price,
        isAvailable: available,
        image: image
      };
    });
  }

  get activeBranchDishes(): MenuItem[] {
    return this.branchDishesList;
  }

  trackByDishId(index: number, item: MenuItem): string {
    return item.id;
  }

  get selectedBranchObj(): Branch | undefined {
    return this.branchService.branches().find(b => b.id === this.selectedBranchId);
  }

  resetDishForm() {
    return {
      name: '',
      category: 'restaurant',
      description: '',
      price: 250,
      unit: 'Portion',
      isVeg: true,
      isPopular: false,
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
      available: true
    };
  }

  openAddDishModal() {
    this.editingDish = null;
    this.dishForm = this.resetDishForm();
    this.isDishModalOpen = true;
  }

  openEditDishModal(item: MenuItem) {
    this.editingDish = item;
    const branchInput = this.branchPriceInputs[item.id];
    this.dishForm = {
      id: item.id,
      name: item.name,
      category: item.category,
      description: item.description,
      price: branchInput ? branchInput.price : (item.currentPrice ?? item.defaultPrice),
      unit: item.unit,
      isVeg: item.isVeg,
      isPopular: item.isPopular,
      image: branchInput?.image || item.image,
      available: branchInput ? branchInput.available : (item.isAvailable ?? true)
    };
    this.isDishModalOpen = true;
  }

  closeDishModal() {
    this.isDishModalOpen = false;
    this.editingDish = null;
  }

  saveDishForm() {
    if (!this.dishForm.name.trim() || this.dishForm.price === undefined) {
      alert('Please fill dish name and price');
      return;
    }

    if (this.editingDish) {
      // 1. Update basic item info in master
      this.menuService.updateMenuItem(this.editingDish.id, {
        name: this.dishForm.name,
        category: this.dishForm.category,
        description: this.dishForm.description,
        unit: this.dishForm.unit,
        isVeg: this.dishForm.isVeg,
        isPopular: this.dishForm.isPopular
      }).subscribe(() => {
        // 2. Update branch-specific price, availability, and image for this branch!
        this.menuService.updateBranchPrice(
          this.editingDish!.id,
          this.selectedBranchId,
          Number(this.dishForm.price),
          this.dishForm.available,
          this.dishForm.image
        ).subscribe(() => {
          this.showToast(`Updated "${this.dishForm.name}" for ${this.selectedBranchObj?.name}`);
          this.closeDishModal();
          this.menuService.loadMenu().subscribe(() => this.syncBranchDishes());
        });
      });
    } else {
      // Add new dish to catalog and set branch pricing & image
      const newDishData: Partial<MenuItem> = {
        name: this.dishForm.name,
        category: this.dishForm.category,
        description: this.dishForm.description,
        defaultPrice: Number(this.dishForm.price),
        unit: this.dishForm.unit,
        isVeg: this.dishForm.isVeg,
        isPopular: this.dishForm.isPopular,
        image: this.dishForm.image,
        branchPricing: {
          [this.selectedBranchId]: {
            price: Number(this.dishForm.price),
            available: this.dishForm.available
          }
        }
      };

      this.menuService.createMenuItem(newDishData).subscribe({
        next: (res) => {
          this.showToast(`Added new dish "${res.item.name}" for ${this.selectedBranchObj?.name}`);
          this.closeDishModal();
          this.menuService.loadMenu().subscribe(() => this.syncBranchDishes());
        },
        error: () => alert('Failed to create dish')
      });
    }
  }

  quickSaveBranchRow(item: MenuItem) {
    const input = this.branchPriceInputs[item.id];
    if (!input) return;

    this.menuService.updateBranchPrice(
      item.id,
      this.selectedBranchId,
      Number(input.price),
      input.available,
      input.image
    ).subscribe({
      next: () => {
        this.showToast(`Saved price & stock for "${item.name}" at ${this.selectedBranchObj?.name}`);
        this.menuService.loadMenu().subscribe();
      }
    });
  }

  deleteDish(item: MenuItem) {
    if (confirm(`Delete "${item.name}" from the menu completely?`)) {
      this.menuService.deleteMenuItem(item.id).subscribe({
        next: () => {
          this.showToast(`Deleted "${item.name}"`);
          this.menuService.loadMenu().subscribe(() => this.syncBranchDishes());
        }
      });
    }
  }

  // ================= TODAY'S RESERVATIONS =================
  loadTodayReservations() {
    this.reservationService.getTodayReservations(this.todayFilterBranch).subscribe({
      next: (res) => {
        if (res && res.success) {
          // Sort chronologically by time slot
          this.todayReservations = (res.reservations || []).sort((a: Reservation, b: Reservation) => {
            return (a.timeSlot || '').localeCompare(b.timeSlot || '');
          });
        }
      },
      error: (err) => console.warn('Could not load today reservations:', err)
    });
  }

  updateReservationStatus(id: string, status: string) {
    this.reservationService.updateStatus(id, status).subscribe({
      next: () => {
        this.showToast(`Reservation marked as ${status}`);
        this.loadTodayReservations();
        this.loadAllReservations();
        this.loadReportData();
      },
      error: (err) => console.warn('Could not update status:', err)
    });
  }

  // ================= ALL RESERVATIONS =================
  loadAllReservations() {
    this.reservationService.getAllReservations(this.reservationFilterBranch).subscribe({
      next: (res) => {
        if (res && res.success) {
          this.allReservations = res.reservations || [];
        }
      },
      error: (err) => console.warn('Could not load reservations:', err)
    });
  }

  // ================= WHATSAPP ORDERS =================
  loadOrders() {
    this.authService.getOrders().subscribe({
      next: (res) => {
        if (res && res.success) {
          this.ordersList = res.orders || [];
        }
      },
      error: (err) => console.warn('Could not load orders:', err)
    });
  }

  // ================= CALENDAR REPORT & CSV DOWNLOAD =================
  loadReportData() {
    // Load orders for reportDate
    this.authService.getOrders(this.reportBranch, this.reportDate).subscribe({
      next: (res) => {
        if (res.success) {
          this.reportOrders = res.orders || [];
        }
      }
    });

    // Load reservations for reportDate
    this.reservationService.getAllReservations(this.reportBranch, this.reportDate).subscribe({
      next: (res) => {
        if (res.success) {
          this.reportReservations = res.reservations || [];
        }
      }
    });
  }

  setQuickReportDate(type: 'today' | 'yesterday' | 'all') {
    if (type === 'today') {
      this.reportDate = this.getTodayYMD();
    } else if (type === 'yesterday') {
      this.reportDate = this.getYesterdayYMD();
    } else {
      this.reportDate = '';
    }
    this.loadReportData();
  }

  get totalReportRevenue(): number {
    return this.reportOrders.reduce((sum, ord) => sum + (Number(ord.totalAmount) || 0), 0);
  }

  downloadCsvReport() {
    const dateLabel = this.reportDate || 'all-dates';
    const branchLabel = this.reportBranch || 'all-branches';
    const filename = `ashiana-report-${dateLabel}-${branchLabel}.csv`;

    // CSV Headers
    const headers = [
      'Type',
      'Reference ID',
      'Date',
      'Time Slot',
      'Branch Name',
      'Customer Name',
      'Customer Phone',
      'Items / Booking Details',
      'Total Amount (INR)',
      'Status / Order Type',
      'Created Timestamp'
    ];

    const rows: string[][] = [];

    // Add Orders
    this.reportOrders.forEach(ord => {
      const itemsDetail = (ord.items || []).map((i: any) => `${i.quantity}x ${i.name}`).join('; ');
      rows.push([
        'WhatsApp Order',
        `#${ord.id}`,
        ord.createdAt ? ord.createdAt.split('T')[0] : '',
        ord.createdAt ? ord.createdAt.split('T')[1]?.slice(0, 5) : '',
        ord.branchName || ord.branchId,
        ord.customerName || 'N/A',
        ord.customerPhone || 'N/A',
        itemsDetail || 'N/A',
        String(ord.totalAmount || 0),
        ord.orderType || 'Takeaway',
        ord.createdAt || ''
      ]);
    });

    // Add Reservations
    this.reportReservations.forEach(res => {
      rows.push([
        'Table Reservation',
        res.id || '',
        res.date,
        res.timeSlot,
        res.branchName || res.branchId,
        res.customerName,
        res.customerPhone,
        `${res.guests} Guests | ${res.seatingPreference || 'Standard'} | ${res.specialRequests || 'None'}`,
        '0', // table reservations don't have order value
        res.status || 'Confirmed',
        res.createdAt || ''
      ]);
    });

    // Escape CSV cell values
    const formatCell = (val: string) => {
      const clean = String(val).replace(/"/g, '""');
      return `"${clean}"`;
    };

    let csvContent = '\uFEFF'; // UTF-8 Byte Order Mark for Excel
    csvContent += headers.map(formatCell).join(',') + '\r\n';

    rows.forEach(r => {
      csvContent += r.map(formatCell).join(',') + '\r\n';
    });

    // Create Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.showToast(`CSV report downloaded: ${filename}`);
  }

  logout() {
    this.authService.logout();
  }
}
