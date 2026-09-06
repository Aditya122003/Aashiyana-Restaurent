import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { DishesComponent } from '../../components/dishes/dishes.component';
import { BakerySectionComponent } from '../../components/bakery-section/bakery-section.component';
import { ReservationModalComponent } from '../../components/reservation-modal/reservation-modal.component';
import { BranchCallModalComponent } from '../../components/branch-call-modal/branch-call-modal.component';
import { CartDrawerComponent } from '../../components/cart-drawer/cart-drawer.component';
import { BranchPromptModalComponent } from '../../components/branch-prompt-modal/branch-prompt-modal.component';
import { FloatingCartBarComponent } from '../../components/floating-cart-bar/floating-cart-bar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    HeroComponent,
    DishesComponent,
    BakerySectionComponent,
    ReservationModalComponent,
    BranchCallModalComponent,
    BranchPromptModalComponent,
    CartDrawerComponent,
    FloatingCartBarComponent,
    FooterComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {}
