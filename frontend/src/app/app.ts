import { Component } from '@angular/core';
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
export class AppComponent {

  // UPLOAD

  selectedFile: File | null = null;

  response: any = null;

  // VERIFY

  verifyFile: File | null = null;

  verifyId: number | null = null;

  verifyResponse: any = null;

  // STATUS

  systemStatus = 'SECURE';

  constructor(private http: HttpClient) {}

  // SELECT FILE

  onFileSelected(event: any): void {

    const file = event.target.files[0];

    if (file) {

      this.selectedFile = file;
    }
  }

  // UPLOAD FILE

  uploadFile(): void {

    if (!this.selectedFile) {

      return;
    }

    const formData = new FormData();

    formData.append('file', this.selectedFile);

    this.http.post<any>(
      'http://localhost:8080/upload',
      formData
    ).subscribe({

      next: (res) => {

        console.log(res);

        this.response = res;
      },

      error: (err) => {

        console.error(err);
      }
    });
  }

  // SELECT VERIFY FILE

  onVerifyFileSelected(event: any): void {

    const file = event.target.files[0];

    if (file) {

      this.verifyFile = file;
    }
  }

  // VERIFY FILE

  verifyFileIntegrity(): void {

    if (!this.verifyFile || !this.verifyId) {

      return;
    }

    const formData = new FormData();

    formData.append('file', this.verifyFile);

    this.http.post<any>(
      `http://localhost:8080/verify/${this.verifyId}`,
      formData
    ).subscribe({

      next: (res) => {

        console.log(res);

        this.verifyResponse = res;

        if (res.integrityValid) {

          this.systemStatus = 'SECURE';
        }
        else {

          this.systemStatus = 'TAMPERED';
        }
      },

      error: (err) => {

        console.error(err);
      }
    });
  }
}