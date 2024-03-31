import { Component } from '@angular/core';
import { AuthService } from '../authenticate/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent implements OnInit{
  currentUser: string | null = null;
  private subscription: Subscription = new Subscription();
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.subscription.add(this.authService.getCurrentUsername().subscribe(username => {
      this.currentUser = username;
    }));
  }

  logout(): void {
    this.authService.logout(); 
    this.currentUser = null; 
    this.router.navigate(['/authenticate']); 
  }
}
