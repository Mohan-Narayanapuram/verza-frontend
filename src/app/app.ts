import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { Product, ProductService } from './services/product.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, AsyncPipe],
  templateUrl: './app.html',
})
export class AppComponent implements OnInit, OnDestroy {
  cart$!: Observable<Product[]>;
  userEmail: string | null = null;
  userName: string | null = null;
  userPhoto: string | null = null;
  isDarkMode = true;

  constructor(private productService: ProductService, private router: Router) {}

  // === Lifecycle Hooks ===
  ngOnInit(): void {
    this.cart$ = this.productService.cart$;
    this.loadUser();
    this.applyTheme();
  }

  ngOnDestroy(): void {
    // Cleanup (future safe)
  }

  // === User Data Handling ===
  loadUser() {
    this.userEmail = localStorage.getItem('userEmail');
    this.userName = localStorage.getItem('userName');
    this.userPhoto = localStorage.getItem('userPhoto');
  }

  get isLoggedIn(): boolean {
    return !!this.userEmail;
  }

  logout() {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userPhoto');
    this.userEmail = this.userName = this.userPhoto = null;
    this.router.navigate(['/']);
    this.closeAllDropdowns();
  }

  // === Navigation Methods (Fixes Dropdown Link Issues) ===
  goToSettings() {
    this.router.navigate(['/settings']);
    this.closeAllDropdowns();
  }

  goToOrders() {
    this.router.navigate(['/orders']);
    this.closeAllDropdowns();
  }

  goToWishlist() {
    this.router.navigate(['/wishlist']);
    this.closeAllDropdowns();
  }

  // === Helper: Close Dropdowns ===
  private closeAllDropdowns() {
    const openMenus = document.querySelectorAll('.dropdown-menu.show, .dropdown-toggle.show');
    openMenus.forEach(el => el.classList.remove('show'));
  }

  // === Theme Handling ===
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle('light-mode', !this.isDarkMode);
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  applyTheme() {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme !== 'light';
    document.documentElement.classList.toggle('light-mode', !this.isDarkMode);
  }
}