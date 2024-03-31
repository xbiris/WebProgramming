import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Movie {
  id: number;
  director: string;
  title: string;
  year: number;
  userRating: number;
  yourRating?: string; 
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'http://localhost/moovie'; 

  constructor(private http: HttpClient) {}

  addMovie(movie: Movie): Observable<any> {
    return this.http.post(`${this.apiUrl}/create.php`, movie);
  }

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/read.php`);
  }

  updateRating(id: number, yourRating: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/update_rating.php`, { id, yourRating });
  }

  deleteMovie(id: number): Observable<any> {
    return this.http.request('delete', `${this.apiUrl}/delete.php`, { body: { id: id } });
  }
}
