import { Injectable } from '@angular/core';

declare var bootstrap: any;

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  show(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const toastContainer = document.getElementById('toastContainer');

    if (!toastContainer) return;

    // Create toast element dynamically
    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center text-bg-${
      type === 'success' ? 'success' : type === 'error' ? 'danger' : 'primary'
    } border-0 mb-2`;
    toastEl.role = 'alert';
    toastEl.ariaLive = 'assertive';
    toastEl.ariaAtomic = 'true';
    toastEl.innerHTML = `
      <div class="d-flex">
        <div class="toast-body fw-semibold">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    `;
    toastContainer.appendChild(toastEl);

    // Show toast
    const toast = new bootstrap.Toast(toastEl);
    toast.show();

    // Remove toast element when hidden
    toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
  }
}