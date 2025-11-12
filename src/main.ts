import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

import { AppComponent } from './app/app';
import { CartComponent } from './app/components/cart/cart.component';
import { CheckoutComponent } from './app/components/checkout/checkout.component';
import { LoginComponent } from './app/components/login/login.component';
import { ProductListComponent } from './app/components/product-list/product-list.component';
import { SettingsComponent } from './app/components/settings/settings.component'; // ✅ Added
import { WishlistComponent } from './app/components/wishlist/wishlist.component';
import { AuthGuard } from './app/guards/auth-guard';
import { firebaseConfig } from './environments/firebaseConfig';

// ✅ Initialize Firebase manually
const app = initializeApp(firebaseConfig);
getAuth(app); // initialize auth

// ✅ Bootstrap the Angular app with routes and providers
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      { path: '', component: ProductListComponent },
      { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
      { path: 'wishlist', component: WishlistComponent, canActivate: [AuthGuard] },
      { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
      { path: 'login', component: LoginComponent },
      { path: 'settings', component: SettingsComponent }, // ✅ new route
      { path: '**', redirectTo: '' } // fallback
    ]),
    importProvidersFrom(HttpClientModule, FormsModule)
  ]
}).catch(err => console.error('🔥 Bootstrap error:', err));