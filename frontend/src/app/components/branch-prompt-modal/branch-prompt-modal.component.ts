import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BranchService } from '../../services/branch.service';
import { MenuService } from '../../services/menu.service';
import { Branch } from '../../models/restaurant.models';

@Component({
  selector: 'app-branch-prompt-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './branch-prompt-modal.component.html',
  styleUrls: ['./branch-prompt-modal.component.css']
})
export class BranchPromptModalComponent implements OnInit {
  branchService = inject(BranchService);
  menuService = inject(MenuService);

  tempSelectedBranchId = '';

  ngOnInit() {
    this.tempSelectedBranchId = this.branchService.selectedBranch()?.id || '';
  }

  get currentSelectedBranch(): Branch | undefined {
    if (!this.tempSelectedBranchId) return undefined;
    return this.branchService.branches().find(b => b.id === this.tempSelectedBranchId);
  }

  confirmSelection() {
    if (!this.tempSelectedBranchId) {
      return;
    }
    
    this.branchService.selectBranchById(this.tempSelectedBranchId);
    this.menuService.loadMenu(this.tempSelectedBranchId).subscribe();
    this.branchService.closeBranchPrompt();
  }

  closeModal() {
    if (this.branchService.selectedBranch()) {
      this.branchService.closeBranchPrompt();
    }
  }
}
