import { Component, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../../services/menu.service';
import { BranchService } from '../../services/branch.service';
import { CartService } from '../../services/cart.service';
import { MenuItem } from '../../models/restaurant.models';

@Component({
  selector: 'app-dishes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.css']
})
export class DishesComponent implements OnInit {
  menuService = inject(MenuService);
  branchService = inject(BranchService);
  cartService = inject(CartService);

  activeCategory = 'all';
  searchQuery = '';
  vegOnly = false;

  constructor() {
    effect(() => {
      const branch = this.branchService.selectedBranch();
      if (branch) {
        this.menuService.loadMenu(branch.id).subscribe();
      }
    });
  }

  ngOnInit() {
    this.menuService.loadCategories().subscribe();
    this.loadCurrentMenu();
  }

  loadCurrentMenu() {
    const branch = this.branchService.selectedBranch();
    this.menuService.loadMenu(branch ? branch.id : undefined).subscribe();
  }

  openBranchModal() {
    this.branchService.openBranchPrompt();
  }

  setCategory(catId: string) {
    this.activeCategory = catId;
  }

  toggleVegOnly() {
    this.vegOnly = !this.vegOnly;
  }

  get activeCategoryObj() {
    const found = this.menuService.categories().find(c => c.id === this.activeCategory);
    if (found) return found;
    if (this.activeCategory === 'all') return { id: 'all', name: 'All Items', icon: '🍽️' };
    if (this.activeCategory === 'dishes') return { id: 'dishes', name: 'Dishes', icon: '🍛' };
    if (this.activeCategory === 'sweets') return { id: 'sweets', name: 'Sweets', icon: '🍬' };
    return { id: this.activeCategory, name: this.activeCategory, icon: '🍽️' };
  }

  get filteredItems(): MenuItem[] {
    let items = this.menuService.menuItems();

    if (this.activeCategory !== 'all') {
      if (this.activeCategory === 'popular') {
        items = items.filter(i => i.isPopular);
      } else if (this.activeCategory === 'dishes') {
        items = items.filter(i => i.category === 'dishes' || i.category === 'restaurant');
      } else if (this.activeCategory === 'sweets' || this.activeCategory === 'dessert') {
        items = items.filter(i => i.category === 'sweets' || i.category === 'dessert');
      } else if (this.activeCategory === 'chinese') {
        items = items.filter(i => i.category === 'chinese' || i.category === 'chinese_snacks');
      } else if (this.activeCategory === 'south_indian') {
        items = items.filter(i => i.category === 'south_indian');
      } else {
        items = items.filter(i => i.category === this.activeCategory);
      }
    }

    if (this.vegOnly) {
      items = items.filter(i => i.isVeg);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      items = items.filter(i => 
        i.name.toLowerCase().includes(q) || 
        (i.description && i.description.toLowerCase().includes(q))
      );
    }

    return items;
  }

  getEffectivePrice(item: MenuItem): number {
    return item.currentPrice !== undefined ? item.currentPrice : item.defaultPrice;
  }

  getItemQuantityInCart(itemId: string): number {
    return this.cartService.getItemQuantity(itemId);
  }

  addToCart(item: MenuItem) {
    this.cartService.addToCart(item, 1);
  }

  increaseQty(item: MenuItem) {
    this.cartService.updateQuantity(item.id, 1);
  }

  decreaseQty(item: MenuItem) {
    this.cartService.updateQuantity(item.id, -1);
  }

  handleImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    if (target && !target.src.includes('photo-1546833999-b9f581a1996d')) {
      target.src = 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80';
    }
  }
}
