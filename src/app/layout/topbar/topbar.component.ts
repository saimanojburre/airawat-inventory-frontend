import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  @Output() toggle = new EventEmitter<void>();

  showProfileMenu = false;
  notificationCount = 3; // demo
  username: any;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}
  ngOnInit() {
    this.username = this.authService.getUsername();
  }

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
