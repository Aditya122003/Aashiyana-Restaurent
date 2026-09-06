import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BranchService } from '../../services/branch.service';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-branch-call-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './branch-call-modal.component.html',
  styleUrls: ['./branch-call-modal.component.css']
})
export class BranchCallModalComponent {
  branchService = inject(BranchService);
  menuService = inject(MenuService);

  close() {
    this.branchService.closeCallModal();
  }

  selectAndClose(branch: any) {
    this.branchService.selectBranch(branch);
    this.menuService.loadMenu(branch.id).subscribe();
    this.close();
  }

  formatTel(phone: string): string {
    return 'tel:' + phone.replace(/[^0-9+]/g, '');
  }
}
