import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { AuthService } from './auth.service';

type CountryCode = 'ro' | 'ch' | 'uk';
@Component({
  selector: 'app-authenticate',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './authenticate.component.html',
  styleUrl: './authenticate.component.css'
})

export class AuthenticateComponent {
  emailLogin: string = '';
  passwordLogin: string = '';
  emailLoginValid: string = '';
  emailRegister: string = '';
  emailRegisterValid: string = '';
  passRegister: string = '';
  passRegisterValid: string = '';
  userName: string = '';
  selectedCity: string = '';
  emailRegisterClass: string = 'validation-sign';
  passRegisterClass: string = 'validation-sign';
  selectedCountry: CountryCode = 'ro'; 
  cities: string[] = [];

  countries = [
    { code: 'ro', name: 'Romania' },
    { code: 'ch', name: 'Switzerland' },
    { code: 'uk', name: 'United Kingdom' }
  ];

  citiesByCountry: { [key in CountryCode]: string[] } = {
    "ro": ["Bucharest", "Cluj-Napoca", "Timisoara"],
    "ch": ["Zurich", "Geneva", "Basel"],
    "uk": ["London", "Manchester", "Birmingham"]
  };
  

  constructor(private authService: AuthService, private router: Router) {
    this.populateCities();
  }

  populateCities(): void {
    this.cities = this.citiesByCountry[this.selectedCountry];
  }

  validateEmail(email: string): boolean {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  validatePassword(pass: string): boolean {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return re.test(pass);
  }

  updateValidationSign(isValid: boolean, type: 'login' | 'register', field: 'email' | 'password'): void {
    let validationClass = isValid ? 'validation-sign valid' : 'validation-sign invalid';
    let validationText = isValid ? "✅" : "❌ - at least 8 characters, one digit, and one upper case letter";
    if(type === 'login') {
      if(field === 'email') {
        this.emailLoginValid = validationText;
      }
    } else {
      if(field === 'email') {
        this.emailRegisterValid = validationText;
        this.emailRegisterClass = validationClass;
      }
      else if(field === 'password') {
        this.passRegisterValid = validationText;
        this.passRegisterClass = validationClass;
      }
    }
  }

  validateEmailLogin(): void {
    const isValidEmail = this.validateEmail(this.emailLogin);
    this.updateValidationSign(isValidEmail, 'login', 'email');
  }

  validateEmailRegister(): void {
    const isValidEmail = this.validateEmail(this.emailRegister);
    this.updateValidationSign(isValidEmail, 'register', 'email');
  }

  validatePasswordRegister(): void {
    const isValidPass = this.validatePassword(this.passRegister);
    this.updateValidationSign(isValidPass, 'register', 'password');
  }

  genres = [
    "Action", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Thriller", "Western"
  ];
  searchGenre: string = '';
  selectedGenre: string | null = null;

  get filteredGenres(): string[] {
    if (!this.searchGenre) {
      return this.genres;
    }
    return this.genres.filter(genre =>
      genre.toLowerCase().includes(this.searchGenre.toLowerCase())
    );
  }

  onSelectGenre(genre: string): void {
    this.selectedGenre = genre;
    this.searchGenre = genre; 
  }

  loginErrorMessage: string = '';
  registerErrorMessage: string = '';

  login(): void {
    this.authService.login(this.emailLogin, this.passwordLogin).subscribe({
      next: (response) => {
        this.router.navigate(['/home']);
        console.log(response.message);
      },
      error: (error) => {
        console.error('Login failed', error);
        this.loginErrorMessage = 'Login failed. Please check your credentials and try again.';
      }
    });
  }

  isAdmin: boolean = false;

  register(): void {
    const user = {
      username: this.userName,
      email: this.emailRegister,
      password: this.passRegister,
      country: this.selectedCountry,
      city: this.selectedCity,
      genre: this.selectedGenre,
      role: this.isAdmin == true ? 'admin' : 'regular'
    };
    
    this.authService.register(user).subscribe({
      next: (response) => {
        this.router.navigate(['/home']);
        console.log(response.message);
      },
      error: (error) => {
        console.error('Registration failed', error);
        this.registerErrorMessage = 'Registration failed. Please check your details and try again.';
      }
    });
  }
  
  currentUser: string | null = null;
  currentUserRole: string | null = null;
  private subscription: Subscription = new Subscription();

  ngOnInit() {
    this.subscription.add(this.authService.getCurrentUsername().subscribe(username => {
      this.currentUser = username;
    }));

    this.subscription.add(this.authService.getCurrentRole().subscribe(role => {
      this.currentUserRole = role; 
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  logout(): void {
    this.authService.logout(); 
    this.currentUser = null; 
    this.router.navigate(['/authenticate']); 
  }
}
