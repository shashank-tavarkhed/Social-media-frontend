import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';

const routes: Routes = [
  {path: "", redirectTo: 'login',pathMatch: 'full' },
  {path: 'login' ,component: LoginComponent},
  {path: 'signup' ,component: SignupComponent},
  {path: 'home' , component: PostListComponent},
  {path: 'create_post' , component: PostCreateComponent, canActivate:[AuthGuard]},
  {path: 'create_post/:postID', component: PostCreateComponent, canActivate:[AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
