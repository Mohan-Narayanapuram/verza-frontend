import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html'
})
export class CartComponent {
  toastMessage = '';
  showToast = false;

  constructor(public productService: ProductService) {}

  get total() {
    return this.productService.getCart().reduce((sum, item) => sum + item.price, 0);
  }

  checkout() {
    if (this.productService.getCart().length === 0) {
      this.show('Your cart is empty!');
      return;
    }
    this.productService.clearCart();
    this.show('Checkout successful! Thank you for your order.');
  }

  show(msg: string) {
    this.toastMessage = msg;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 2000);
  }
}