import { Component } from '@angular/core';
import {RouterLink, RouterOutlet, Router} from '@angular/router';

@Component({
  selector: 'app-test-page',
  // imports: [
  //   RouterLink,
  //   RouterOutlet
  // ],
  templateUrl: './test-page.component.html',
  standalone: true,
  styleUrl: './test-page.component.css'
})
export class TestPageComponent {
  constructor(private router: Router) {}

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
