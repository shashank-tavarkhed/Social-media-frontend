import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit,OnDestroy {
  isLoading =false;
  authsersub:Subscription;

  constructor(private authService: AuthService,private route: Router) { }

  ngOnInit(): void {
    this.authsersub = this.authService.getAuthSub().subscribe((status)=>{
      this.isLoading = false;
    })
  }

  onLogin(loginData: NgForm){
    if(!loginData.valid) return;
    this.isLoading =true;
    this.authService.login(loginData.value.email, loginData.value.password);
  }

  ngOnDestroy(): void {
      this.authsersub.unsubscribe();
  }
}
