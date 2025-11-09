import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { Product, ProductService } from './services/product.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, AsyncPipe],
  templateUrl: './app.html'
})
export class AppComponent implements OnInit {
  cart$!: Observable<Product[]>;
  userEmail: string | null = null;
  isDarkMode = true;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.cart$ = this.productService.cart$;
    this.userEmail = localStorage.getItem('userEmail');

    // 🌗 Load saved theme
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme !== 'light';
    document.documentElement.classList.toggle('light-mode', !this.isDarkMode);
  }

  get isLoggedIn(): boolean {
    return !!this.userEmail;
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle('light-mode', !this.isDarkMode);
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  logout() {
    localStorage.removeItem('userEmail');
    this.userEmail = null;
    this.router.navigate(['/']);
  }
}