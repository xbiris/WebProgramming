import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { MovieService } from './movies.service';
import { AuthService } from '../authenticate/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

export interface Movie {
  id: number;
  director: string;
  title: string;
  year: number;
  userRating: number;
  yourRating?: string; 
}

@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.css'],
  imports: [CommonModule, FormsModule], 
  standalone: true,
})
export class RatingsComponent implements OnInit {
  currentUser: string | null = null;
  currentUserRole: string | null = null;
  private subscription: Subscription = new Subscription();
  constructor(private movieService: MovieService, private authService: AuthService, private router: Router) {}
  movies: Movie[] = [
    { id: 1, director: 'Alfred Hitchcock', title: 'Psycho', year: 1960, userRating: 8.5, yourRating: 'Rate' },
  ];

  id: number = 1;
  director: string = '';
  title: string = '';
  year: number = 0;
  userRating: number = 0;
  yourRating: string ='Rate'

  ngOnInit(): void {
    this.movieService.getMovies().subscribe({
      next: (movies) => {
        this.movies = movies.map(movie => ({
          id: movie.id, 
          director: movie.director,
          title: movie.title,
          year: movie.year,
          userRating: movie.userRating,
          yourRating: movie.yourRating || 'Rate',
        }));
      },
      error: (error) => console.error('There was an error!', error)
    });    

    this.subscription.add(this.authService.getCurrentUsername().subscribe(username => {
      this.currentUser = username;
    }));

    this.subscription.add(this.authService.getCurrentRole().subscribe(role => {
      this.currentUserRole = role; 
    }));
    
  }

  trackByFn(index: number, item: Movie): any {
    return `${item.title}-${item.year}`;
  }
  
  setRating(movie: Movie, rating: string): void {
    movie.yourRating = rating; 
    this.movieService.updateRating(movie.id, rating).subscribe({
      next: (response) => console.log(response.message),
      error: (error) => console.error('Error updating rating:', error)
    });
    console.log(this.currentUserRole);
    console.log(this.currentUser);
  }

  submitMovie(): void {
    const newMovie: Movie = {
      id: this.id,
      director: this.director,
      title: this.title,
      year: this.year,
      userRating: this.userRating,
      yourRating: 'Rate',
    };
    
    this.movieService.addMovie(newMovie).subscribe({
      next: (response) => {
        console.log(response.message);
      },
      error: (error) => {
        console.log('There was an error:', error);
      }
    });

    this.director = '';
    this.title = '';
    this.year = 0;
    this.userRating = 0;
   
    this.movies.push(newMovie);
  }

  deleteMovie(movieId: number): void {
    this.movieService.deleteMovie(movieId).subscribe({
      next: (response) => {
        console.log(response.message);
        this.movies = this.movies.filter(movie => movie.id !== movieId);
      },
      error: (error) => {
        console.error('There was an error:', error);
      }
    });
  }
  logout(): void {
    this.authService.logout(); 
    this.currentUser = null; 
    this.router.navigate(['/authenticate']); 
  }
}
