import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit,OnDestroy {
  isAuthenticated:boolean = false;
  private authListener:Subscription;
  constructor(private authService: AuthService) { }

  onLogout(){
    this.authService.logout();
  }

  ngOnInit(): void {
    this.authListener=this.authService.getAuthSub().subscribe(res =>{
      this.isAuthenticated =res;
    });
  }

  ngOnDestroy(): void {
      this.authListener.unsubscribe();
  }
}
