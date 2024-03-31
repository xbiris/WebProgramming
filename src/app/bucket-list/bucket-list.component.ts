import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../authenticate/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bucket-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bucket-list.component.html',
  styleUrl: './bucket-list.component.css'
})
export class BucketListComponent {
  isString(item: any): item is string {
    return typeof item === 'string';
  }
  isObject(item: any): item is { title: string; movies: string[] } {
    return typeof item === 'object' && item !== null && !Array.isArray(item);
  }

  movies: Array<string | { title: string; movies: string[] }> = [
    "The Godfather (1972)",
    "GoodFellas (1990)",
    "The Silence of the Lambs (1991)",
    "Schindler's List (1993)",
    "Forrest Gump (1994)",
    "The Shawshank Redemption (1994)",
    "Pulp Fiction (1994)",
    "The Green Mile (1999)",
    { title: "The Alien Trilogy", movies: ["Alien (1979)", "Aliens (1986)", "Alien 3 (1992)"] },
    "Eyes Wide Shut (1999)",
    "The Matrix (1999)",
    "Fight Club (1999)",
    "Catch Me If You Can (2002)",
    "The Butterfly Effect (2004)",
    "Into the Wild (2007)"
  ];

  horrorMovies: Array<string | { title: string; movies: string[] }> = [
    "The Exorcist (1973)",
    "Halloween (1978)",
    { title: "The Alien Trilogy", movies: ["Alien (1979)", "Aliens (1986)", "Alien 3 (1992)"] },
    "The Shining (1980)",
    "Train to Busan (2016)"
  ];

  mysteryMovies: Array<string | { title: string; movies: string[] }> = [
    "Vertigo (1958)",
    "Rear Window (1954)",
    { title: "The Scream Trilogy", movies: ["Scream (1996)", "Scream 2 (1997)", "Scream 3 (2000)"] },
    "Zodiac (2007)",
    "Prisoners (2013)"
  ];

  moviesViewAll: boolean = false;
  horrorViewAll: boolean = false;
  mysteryViewAll: boolean = false;

  toggleView(list: 'movies' | 'horror' | 'mystery'): void {
    console.log("gwerouhbg uiwrej");
    switch (list) {
      case 'movies':
        this.moviesViewAll = !this.moviesViewAll;
        break;
      case 'horror':
        this.horrorViewAll = !this.horrorViewAll;
        break;
      case 'mystery':
        this.mysteryViewAll = !this.mysteryViewAll;
        break;
    }
  }

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
