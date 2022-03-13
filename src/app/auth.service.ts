import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription, BehaviorSubject  } from 'rxjs';
import {environment} from "../environments/environment"

const BACKEND_URL=environment.API_URL+'/user/'

interface User{
  email: string,
  password: string,
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private token:string;
  private auth = false;
  private isAuthorised = new BehaviorSubject <boolean>(false);
  private usrID:string;
  private timeout:any;

  constructor(private http:HttpClient,private router: Router) { }

  getUserID(){
    return this.usrID;
  }

  getToken(){
    return this.token;
  }

  getAuthStatus(){
    return this.auth;
  }

  getAuthSub(){
    return this.isAuthorised.asObservable();
  }

  createUser(email:string,password:string){
    const user:User ={
      email: email,
      password:password
    }
    this.http.post(BACKEND_URL+'signup', user,)
    .subscribe(response =>{
      console.log('user >>> ', response);
      alert('User created')
      this.router.navigateByUrl('/login');
    },
    error=>{
      this.isAuthorised.next(false);
      }
    )

  }

  login(email:string,password:string){
    const user:User ={
      email: email,
      password:password
    }
    this.http.post<{token:string, expiresIn:number, userId:string}>(BACKEND_URL+'login',user).subscribe(
      res=>{
        if(res.token){
          this.token = res.token;
          this.usrID = res.userId;
          this.setAuthTimer(res.expiresIn);
          this.auth =true;
          this.isAuthorised.next(true);
          localStorage.setItem('token',res.token);
          localStorage.setItem('expires',`${res.expiresIn}`);
          localStorage.setItem('userId',res.userId);
          console.log(this.usrID);
          this.router.navigateByUrl('/home');
        }else{
          console.log('Error logging!');
        }
      },

      error=>{
        this.isAuthorised.next(false);
      })


  }

  logout(){
    this.token =null;
    this.auth =false;
    this.usrID = null;
    this.isAuthorised.next(false);
    this.router.navigate(['/home']);
    localStorage.clear();
    clearTimeout(this.timeout);
    this.router.navigate(['/'])
  }

  autoAuth(){
    const authdata = this.checkToken();
    if(!authdata) return;
    const token = authdata.token;
    const userId= authdata.userId;
    const now = new Date();
    const expiresIn = authdata.expiresIn.getTime() - now.getTime();

    if(expiresIn>0){
      this.token = token;
      this.auth = true;
      this.usrID = userId;
      this.setAuthTimer(expiresIn / 1000);
      this.isAuthorised.next(true);
    }
  }

  private checkToken(){
    const token = localStorage.getItem('token');
    const expires = localStorage.getItem('expires');
    const userId = localStorage.getItem('userId');

    if(!token || !expires || !userId) return;

    return {
      token : token,
      expiresIn : new Date(expires),
      userId : userId,
    }
  }

  private setAuthTimer(duration:number){
    this.timeout = setTimeout(() => {
      this.logout()
    }, duration *1000);
  }

}
