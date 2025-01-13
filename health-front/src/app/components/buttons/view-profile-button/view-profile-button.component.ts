import {Component, Injectable} from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-view-profile-button',
  templateUrl: './view-profile-button.component.html',
  standalone: true,
  styleUrls: ['./view-profile-button.component.css']
})
export class ViewProfileButtonComponent {
  constructor(private router: Router) {}

  viewProfile(): void {
    this.router.navigate(['/profile']);
  }
}
