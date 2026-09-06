import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Branch } from '../models/restaurant.models';
import { getApiBaseUrl } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  private get apiUrl() {
    return getApiBaseUrl();
  }

  branches = signal<Branch[]>([]);
  selectedBranch = signal<Branch | null>(null);
  isCallModalOpen = signal<boolean>(false);
  
  // Controls the main screen 1-second branch selection prompt
  isPromptOpen = signal<boolean>(false);

  constructor(private http: HttpClient) {
    this.loadBranches().subscribe(() => {
      // Prompt user to select branch on main screen after 1 second as requested
      setTimeout(() => {
        this.openBranchPrompt();
      }, 1000);
    });
  }

  loadBranches(): Observable<any> {
    return this.http.get<{ success: boolean; branches: Branch[] }>(`${this.apiUrl}/branches`).pipe(
      tap(res => {
        if (res.success && res.branches.length > 0) {
          this.branches.set(res.branches);
          
          const savedBranchId = localStorage.getItem('ashiana_selected_branch');
          const found = res.branches.find(b => b.id === savedBranchId) || res.branches[0];
          this.selectedBranch.set(found);
        }
      })
    );
  }

  selectBranch(branch: Branch) {
    this.selectedBranch.set(branch);
    localStorage.setItem('ashiana_selected_branch', branch.id);
  }

  selectBranchById(branchId: string) {
    const branch = this.branches().find(b => b.id === branchId);
    if (branch) {
      this.selectBranch(branch);
    }
  }

  openBranchPrompt() {
    this.isPromptOpen.set(true);
  }

  closeBranchPrompt() {
    this.isPromptOpen.set(false);
  }

  openCallModal() {
    this.isCallModalOpen.set(true);
  }

  closeCallModal() {
    this.isCallModalOpen.set(false);
  }
}
