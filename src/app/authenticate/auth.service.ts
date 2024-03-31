import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  country: string;
  city?: string; 
  movie_genre?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost/moovie'; 

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const savedUsername = localStorage.getItem('currentUsername');
      const savedRole = localStorage.getItem('currentRole');
      if (savedUsername) {
        this.setCurrentUsername(savedUsername);
      }
      if (savedRole) {
        this.setCurrentRole(savedRole);
      }
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login.php`, { email, password }).pipe(
        tap(response => {
            if (response.message === 'Login successful') {
                this.setCurrentUsername(response.user.username);
                this.setCurrentRole(response.user.role);
            } else {
                throw new Error(response.message || 'Login failed');
            }
        }),
        catchError(error => {
            return throwError(() => new Error(error.message || 'Something went wrong with the login'));
        })
    );
  }


  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register.php`, user);
  }

  setUser(user: any): void {
    localStorage.setItem('users', JSON.stringify(user));
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/read_users.php`);
  }

  private currentUsername = new BehaviorSubject<string>('');
  private currentRole = new BehaviorSubject<string>('');

  setCurrentUsername(username: string): void {
    this.currentUsername.next(username);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('currentUsername', username);
    }
  }
  
  getCurrentUsername(): Observable<string> {
    return this.currentUsername.asObservable();
  }
  
  setCurrentRole(role: string): void {
    this.currentRole.next(role);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('currentRole', role);
    }
  }
  
  getCurrentRole(): Observable<string> {
    return this.currentRole.asObservable();
  }
  

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUsername');
      localStorage.removeItem('currentRole');
    }
    this.setCurrentUsername('');
    this.setCurrentRole('');
  }

}
