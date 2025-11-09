import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../services/product.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent {
  products: Product[] = [];
  filtered: Product[] = [];
  query = '';
  minPrice?: number;
  maxPrice?: number;
  toastMessage = '';
  showToast = false;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.filtered = data;
    });
  }

  search() {
    const q = this.query.trim().toLowerCase();
    this.filtered = this.products.filter(p => {
      const matchesQ = !q || p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q);
      const matchesMin = !this.minPrice || p.price >= this.minPrice;
      const matchesMax = !this.maxPrice || p.price <= this.maxPrice;
      return matchesQ && matchesMin && matchesMax;
    });
  }

  addToCart(p: Product) {
    this.productService.addToCart(p);
    this.showToastMsg('Product added to cart');
  }

  addToWishlist(p: Product) {
    this.productService.addToWishlist(p);
    this.showToastMsg('Product added to wishlist');
  }

  showToastMsg(msg: string) {
    this.toastMessage = msg;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 2200);
  }
}