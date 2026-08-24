import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {

  // CONFIG / API URL
  customApiUrl: string = '';
  backendStatus: 'CONNECTED' | 'UNREACHABLE' | 'CHECKING' = 'CHECKING';

  // UPLOAD
  selectedFile: File | null = null;
  response: any = null;
  isUploading: boolean = false;
  uploadError: string | null = null;

  // VERIFY
  verifyFile: File | null = null;
  verifyId: number | null = null;
  verifyResponse: any = null;
  isVerifying: boolean = false;
  verifyError: string | null = null;

  // STATUS
  systemStatus = 'SECURE';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      const savedUrl = localStorage.getItem('API_URL');
      if (savedUrl) {
        this.customApiUrl = savedUrl;
      }
    }
    if (!this.customApiUrl) {
      this.customApiUrl = this.getApiUrl();
    }
    this.checkBackendHealth();
  }

  getApiUrl(): string {
    if (this.customApiUrl && this.customApiUrl.trim()) {
      return this.customApiUrl.trim().replace(/\/+$/, '');
    }
    if (typeof localStorage !== 'undefined' && localStorage.getItem('API_URL')) {
      return localStorage.getItem('API_URL')!.trim().replace(/\/+$/, '');
    }
    if (typeof window !== 'undefined' && (window as any).API_URL) {
      return (window as any).API_URL.replace(/\/+$/, '');
    }
    if (typeof window !== 'undefined' && window.location) {
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:8080';
      }
    }
    return 'https://secure-file-verification-backend.onrender.com';
  }

  updateApiUrl(url: string): void {
    this.customApiUrl = url;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('API_URL', url.trim());
    }
    this.checkBackendHealth();
  }

  checkBackendHealth(): void {
    this.backendStatus = 'CHECKING';
    const targetUrl = this.getApiUrl();
    this.http.get(targetUrl, { responseType: 'text' }).subscribe({
      next: () => {
        this.backendStatus = 'CONNECTED';
      },
      error: () => {
        this.backendStatus = 'UNREACHABLE';
      }
    });
  }

  // SELECT FILE
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadError = null;
    }
  }

  // UPLOAD FILE
  uploadFile(): void {
    if (!this.selectedFile) {
      return;
    }

    this.isUploading = true;
    this.uploadError = null;
    this.response = null;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    const endpoint = `${this.getApiUrl()}/upload`;

    this.http.post<any>(endpoint, formData).subscribe({
      next: (res) => {
        console.log('Upload success:', res);
        this.response = res;
        this.isUploading = false;
        this.backendStatus = 'CONNECTED';
      },
      error: (err) => {
        console.error('Upload failed:', err);
        this.isUploading = false;
        this.backendStatus = 'UNREACHABLE';
        if (err.status === 0) {
          this.uploadError = `Unable to connect to backend at "${this.getApiUrl()}". Please verify the backend service URL or wait if Render is starting up.`;
        } else {
          this.uploadError = `Upload failed (Status ${err.status}): ${err.message || 'Server error'}`;
        }
      }
    });
  }

  // SELECT VERIFY FILE
  onVerifyFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.verifyFile = file;
      this.verifyError = null;
    }
  }

  // VERIFY FILE
  verifyFileIntegrity(): void {
    if (!this.verifyFile || !this.verifyId) {
      return;
    }

    this.isVerifying = true;
    this.verifyError = null;
    this.verifyResponse = null;

    const formData = new FormData();
    formData.append('file', this.verifyFile);

    const endpoint = `${this.getApiUrl()}/verify/${this.verifyId}`;

    this.http.post<any>(endpoint, formData).subscribe({
      next: (res) => {
        console.log('Verification success:', res);
        this.verifyResponse = res;
        this.isVerifying = false;
        this.backendStatus = 'CONNECTED';

        if (res.integrityValid) {
          this.systemStatus = 'SECURE';
        } else {
          this.systemStatus = 'TAMPERED';
        }
      },
      error: (err) => {
        console.error('Verification failed:', err);
        this.isVerifying = false;
        this.backendStatus = 'UNREACHABLE';
        if (err.status === 0) {
          this.verifyError = `Unable to connect to backend at "${this.getApiUrl()}". Please verify the backend service URL or wait if Render is starting up.`;
        } else {
          this.verifyError = `Verification failed (Status ${err.status}): ${err.message || 'Server error'}`;
        }
      }
    });
  }
}