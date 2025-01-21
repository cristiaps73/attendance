import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class RegisterComponent {
  username = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match'; // Mesaj de eroare
      return;
    }

    this.authService.register(this.username, this.password).subscribe({
      next: () => {
        this.router.navigate(['/login']); // Redirecționează la pagina de login
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Registration failed';
        console.error(err);
      },
    });
  }
}
