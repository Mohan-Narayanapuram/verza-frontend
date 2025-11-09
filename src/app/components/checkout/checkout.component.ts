import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent {
  name = '';
  address = '';
  payment = 'COD';
  showToast = false;
  toastMessage = '';

  constructor(public productService: ProductService) {}

  get total() {
    return this.productService.getCart().reduce((sum, item) => sum + item.price, 0);
  }

  placeOrder() {
    if (!this.name || !this.address) {
      this.show('Please fill in all details.');
      return;
    }

    if (this.productService.getCart().length === 0) {
      this.show('Your cart is empty.');
      return;
    }

    this.productService.clearCart();
    this.show(`Order placed successfully! Thank you, ${this.name}.`);
    this.name = '';
    this.address = '';
  }

  show(msg: string) {
    this.toastMessage = msg;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 2000);
  }
}