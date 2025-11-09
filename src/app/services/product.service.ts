import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Product {
  id?: number;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'http://localhost:8080/api/products';

  private cartKey = 'my_cart_v1';
  private wishlistKey = 'my_wishlist_v1';

  private cartSubject = new BehaviorSubject<Product[]>(this.loadCart());
  cart$ = this.cartSubject.asObservable();

  private wishlistSubject = new BehaviorSubject<Product[]>(this.loadWishlist());
  wishlist$ = this.wishlistSubject.asObservable();

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  private loadCart(): Product[] {
    try {
      return JSON.parse(localStorage.getItem(this.cartKey) || '[]');
    } catch {
      return [];
    }
  }

  private loadWishlist(): Product[] {
    try {
      return JSON.parse(localStorage.getItem(this.wishlistKey) || '[]');
    } catch {
      return [];
    }
  }

  private saveCart(list: Product[]) {
    localStorage.setItem(this.cartKey, JSON.stringify(list));
    this.cartSubject.next(list);
  }

  private saveWishlist(list: Product[]) {
    localStorage.setItem(this.wishlistKey, JSON.stringify(list));
    this.wishlistSubject.next(list);
  }

  addToCart(p: Product) {
    const list = this.loadCart();
    list.push(p);
    this.saveCart(list);
  }

  removeFromCart(index: number) {
    const list = this.loadCart();
    list.splice(index, 1);
    this.saveCart(list);
  }

  clearCart() {
    this.saveCart([]);
  }

  getCart(): Product[] {
    return this.loadCart();
  }

  addToWishlist(p: Product) {
    const list = this.loadWishlist();
    if (!list.find(x => x.id === p.id)) {
      list.push(p);
      this.saveWishlist(list);
    }
  }

  removeFromWishlist(index: number) {
    const list = this.loadWishlist();
    list.splice(index, 1);
    this.saveWishlist(list);
  }

  getWishlist(): Product[] {
    return this.loadWishlist();
  }
}