import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  @Output() toggle = new EventEmitter<void>();

  showProfileMenu = false;
  notificationCount = 3; // demo

  constructor(private router: Router) {}

  menuClick() {
    this.toggle.emit();
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  openNotifications() {
    console.log('Open notifications');
  }

  goProfile(event: Event) {
    event.stopPropagation();
    this.router.navigate(['/app/profile']);
    this.showProfileMenu = false;
  }

  goSettings(event: Event) {
    event.stopPropagation();
    this.router.navigate(['/settings']);
    this.showProfileMenu = false;
  }

  logout(event?: Event) {
    event?.stopPropagation();
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
