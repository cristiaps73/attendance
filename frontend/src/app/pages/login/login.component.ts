import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: (response: any) => {
        console.log('SUCCES LOGIN');
        this.authService.saveToken(response.token); // Salvează token-ul
        console.log('SUCCES LOGIN2');
        this.router.navigate(['/home']); // Redirecționează către pagina Home
        console.log('SUCCES LOGIN3');
      },
      error: (err) => {
        this.errorMessage = 'Invalid username or password'; // Afișează un mesaj de eroare
        console.error(err);
      },
    });
  }
  

  goToRegister(): void {
    this.router.navigate(['/register']); // Redirecționează către pagina de Register
  }
}
