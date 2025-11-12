import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  // === User Data ===
  userName = '';
  userEmail = '';
  userPhoto = '';
  userPhone = '';
  userGender = '';
  userDob = '';

  // === UI States ===
  themeMode: 'dark' | 'light' = 'dark';
  toastMessage = '';
  toastType: 'success' | 'error' | '' = '';
  showToast = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUser();
    this.loadTheme();
  }

  /** ==========================
   * 🧩 USER PROFILE HANDLING
   * ========================== */
  loadUser() {
    this.userName = localStorage.getItem('userName') || 'Guest User';
    this.userEmail = localStorage.getItem('userEmail') || 'guest@example.com';
    this.userPhoto = localStorage.getItem('userPhoto') || '';
    this.userPhone = localStorage.getItem('userPhone') || '';
    this.userGender = localStorage.getItem('userGender') || '';
    this.userDob = localStorage.getItem('userDob') || '';

    // Generate default avatar if no photo exists
    if (!this.userPhoto) {
      this.userPhoto = this.generateAvatar(this.userName);
    }
  }

  /** 🎨 Generate avatar with Verza fixed palette */
  generateAvatar(name: string): string {
    const firstLetter = name.charAt(0).toUpperCase();
    const palette = [
      '#6C63FF', // Electric Violet (Main)
      '#4B0082', // Royal Indigo
      '#8B5CF6', // Soft Purple
      '#5E60CE', // Indigo Glow
      '#7B2CBF'  // Vibrant Violet
    ];
    const color = palette[firstLetter.charCodeAt(0) % palette.length];
    const svg = `
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="50" ry="50" fill="${color}"></rect>
        <text x="50%" y="55%" text-anchor="middle" dy=".3em" font-size="48"
          fill="white" font-family="Poppins, sans-serif">${firstLetter}</text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  /** ✅ Save profile data */
  saveProfile() {
    if (this.userName.trim()) {
      localStorage.setItem('userName', this.userName);
      localStorage.setItem('userPhoto', this.generateAvatar(this.userName));
    }

    if (this.userPhone.trim()) {
      if (!/^\d{10}$/.test(this.userPhone)) {
        this.showToastMessage('Please enter a valid 10-digit mobile number.', 'error');
        return;
      }
      localStorage.setItem('userPhone', this.userPhone);
    }

    if (this.userGender.trim()) {
      localStorage.setItem('userGender', this.userGender);
    }

    if (this.userDob.trim()) {
      localStorage.setItem('userDob', this.userDob);
    }

    this.showToastMessage('Profile updated successfully!', 'success');

    // Redirect to home after short delay
    setTimeout(() => this.router.navigate(['/']), 1600);
  }

  /** ==========================
   * 🌗 THEME SYSTEM
   * ========================== */
  loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    this.themeMode = savedTheme === 'light' ? 'light' : 'dark';
    document.documentElement.classList.toggle('light-mode', this.themeMode === 'light');
  }

  setTheme(mode: 'light' | 'dark') {
    this.themeMode = mode;
    document.documentElement.classList.toggle('light-mode', mode === 'light');
    localStorage.setItem('theme', mode);
    this.showToastMessage(`Switched to ${mode} mode`, 'success');
  }

  /** ==========================
   * 🔔 TOAST SYSTEM
   * ========================== */
  showToastMessage(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    // Hide after 2.5s
    setTimeout(() => (this.showToast = false), 2500);
  }

  /** ==========================
   * 🚪 LOGOUT HANDLER
   * ========================== */
  logout() {
    localStorage.clear();
    this.showToastMessage('Logged out successfully!', 'success');
    setTimeout(() => this.router.navigate(['/login']), 1000);
  }
}