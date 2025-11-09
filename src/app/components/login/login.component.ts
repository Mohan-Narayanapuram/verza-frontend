import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { getAuth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  otp = '';
  step = 1;
  showAlert = false;
  alertMessage = '';
  alertType = 'primary';
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  sendOtp() {
    if (!this.email) {
      this.show('Please enter a valid email', 'danger');
      return;
    }
    this.http.post(`${this.apiUrl}/send-otp`, { email: this.email }).subscribe({
      next: () => {
        this.step = 2;
        this.show('OTP sent successfully to your email', 'success');
      },
      error: () => this.show('Failed to send OTP. Try again.', 'danger')
    });
  }

  verifyOtp() {
    if (!this.otp || this.otp.length !== 6) {
      this.show('Enter the 6-digit OTP', 'warning');
      return;
    }

    this.http.post(`${this.apiUrl}/verify-otp`, { email: this.email, otp: this.otp }).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          localStorage.setItem('userEmail', this.email);
          this.show('Login successful! Redirecting...', 'success');
          setTimeout(() => this.router.navigate(['/']), 1000);
        } else {
          this.show('Invalid OTP. Try again.', 'danger');
        }
      },
      error: () => this.show('Server error. Try again.', 'danger')
    });
  }

  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user && user.email) {
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userName', user.displayName || 'Verza User');
        localStorage.setItem('userPhoto', user.photoURL || '');

        this.show(`Welcome to Verza Store, ${user.displayName || 'Guest'}!`, 'success');
        setTimeout(() => this.router.navigate(['/']), 1000);
      }
    } catch (error) {
      console.error(error);
      this.show('Google Sign-In failed. Try again.', 'danger');
    }
  }

  show(msg: string, type: string) {
    this.alertMessage = msg;
    this.alertType = type;
    this.showAlert = true;
    setTimeout(() => (this.showAlert = false), 2500);
  }
}