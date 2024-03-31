import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../authenticate/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

interface Movie {
  director: string;
  title: string;
  rating: number;
}


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  currentUser: string | null = null;
  private subscription: Subscription = new Subscription();
  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit() {
    this.subscription.add(this.authService.getCurrentUsername().subscribe(username => {
      this.currentUser = username;
    }));
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  movies: Movie[] = [
    { director: 'Christopher Nolan', title: 'Inception', rating: 8.8 },
    { director: 'Quentin Tarantino', title: 'Pulp Fiction', rating: 8.9 },
    { director: 'David Fincher', title: 'Fight Club', rating: 8.8 },
    { director: 'Martin Scorsese', title: 'Goodfellas', rating: 8.7 },
    { director: 'Francis Ford Coppola', title: 'The Godfather', rating: 9.2 },
    { director: 'Steven Spielberg', title: 'Schindler’s List', rating: 8.9 },
    { director: 'Peter Jackson', title: 'The Lord of the Rings: The Return of the King', rating: 8.9 },
    { director: 'Alfred Hitchcock', title: 'Psycho', rating: 8.5 },
    { director: 'Ridley Scott', title: 'Blade Runner', rating: 8.1 },
    { director: 'Stanley Kubrick', title: '2001: A Space Odyssey', rating: 8.3 }
  ];
  

  searchTerm: string = '';
  sortColumn: keyof Movie | null = null;
  sortDirection: 'asc' | 'desc' | '' = '';

  searchMovies(): Movie[] {
    let filteredMovies = this.movies.filter(movie =>
      movie.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      movie.director.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    if (this.sortColumn && this.sortDirection) {
      filteredMovies = filteredMovies.sort((a, b) => {
        const aValue = a[this.sortColumn!];
        const bValue = b[this.sortColumn!];
        if (aValue < bValue) {
          return this.sortDirection === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return this.sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return filteredMovies;
  }

  onSort(column: keyof Movie): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  isImageModalOpen: boolean = false;

  showImageModal(): void {
    this.isImageModalOpen = true;
  }

  logout(): void {
    this.authService.logout(); 
    this.currentUser = null; 
    this.router.navigate(['/authenticate']); 
  }
}
