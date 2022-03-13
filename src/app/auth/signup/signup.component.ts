import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit,OnDestroy{
  isLoading =false;
  authsersub:Subscription;
  constructor(private authService: AuthService ) { }

  ngOnInit(): void {
    this.authsersub = this.authService.getAuthSub().subscribe((status)=>{
      this.isLoading = false;
    })
  }

  onSignup(loginData: NgForm){
    if(!loginData.valid) return;
    this.isLoading = true;
    // console.log('Login>>>> ',loginData.value );
    this.authService.createUser(loginData.value.email, loginData.value.password);
  }

  ngOnDestroy(): void {
    this.authsersub.unsubscribe();
  }

}
