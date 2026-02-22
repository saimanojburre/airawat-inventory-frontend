import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  @Output() toggle = new EventEmitter<void>();

  constructor(private router: Router) {}

  menuClick() {
    this.toggle.emit();
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
