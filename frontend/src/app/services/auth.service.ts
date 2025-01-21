import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:5000/api';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient, private router: Router) {}

  register(username: string, password: string): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/register`, { username, password })
      .pipe(catchError(this.handleError));
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { username, password }).pipe(
      catchError(this.handleError),
      tap((response: any) => {
        this.saveToken(response.token);
        this.router.navigate(['/home']);
      })
    );
  }
  

  logout(): void {
    localStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  private hasToken(): boolean {
    return this.isTokenValid();
  }

  private isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() / 1000 < payload.exp;
    } catch (e) {
      return false;
    }
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
    this.isAuthenticatedSubject.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error(error.error?.message || 'Something went wrong'));
  }
}
