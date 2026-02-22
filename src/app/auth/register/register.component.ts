import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  hidePassword = true;
  error = '';
  roles = [
    { label: 'User', value: 'USER' },
    { label: 'Manager', value: 'MANAGER' },
    { label: 'Owner', value: 'OWNER' },
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}

  registerForm = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
    role: ['', Validators.required], // ✅ NEW
  });

  register() {
    if (this.registerForm.invalid) return;

    const { password, confirmPassword } = this.registerForm.value;

    if (password !== confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        alert('Registerd Successfully');
        this.goToLogin();
      },
      error: () => (this.error = 'Registration failed'),
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
