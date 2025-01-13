import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import {HeaderComponent} from './components/header/header.component';
import {HttpClientModule} from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, HeaderComponent, HttpClientModule],
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {

  // implements OnInit {
  // constructor(
  //   @Inject(PLATFORM_ID) private platformId: Object,
  //   private authService: AuthService
  // ) {}

  // ngOnInit(): void {
  //   if (isPlatformBrowser(this.platformId)) {
  //     const token = localStorage.getItem('token');
  //     if (token) {
  //       this.authService.restoreAuthState(token);
  //       console.log('Authentication state restored');
  //     } else {
  //       console.log('User is not authenticated');
  //     }
  //   }
  // }
}
