import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticateComponent } from './authenticate/authenticate.component';
import { BucketListComponent } from './bucket-list/bucket-list.component';
import { HomeComponent } from './home/home.component';
import { RatingsComponent } from './ratings/ratings.component';
import { ReviewComponent } from './review/review.component';

export const routes: Routes = [
  { path: 'authenticate', component: AuthenticateComponent },
  { path: 'bucket-list', component: BucketListComponent },
  { path: 'home', component: HomeComponent },
  { path: 'ratings', component: RatingsComponent },
  { path: 'reviews', component: ReviewComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
