import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  hidePassword = true;
  hideConfirmPassword = true;
  error = '';
  submitted = false;

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

  showError(controlName: string, error: string): boolean {
    const control = this.registerForm.get(controlName);

    return !!(
      control &&
      control.hasError(error) &&
      (control.touched || this.submitted)
    );
  }
  /* ================= FORM ================= */

  registerForm = this.fb.group(
    {
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/),
        ],
      ],

      confirmPassword: ['', Validators.required],
    },
    { validators: this.passwordMatchValidator },
  );

  /* ================= GETTERS ================= */

  get f() {
    return this.registerForm.controls;
  }

  /* ================= PASSWORD MATCH ================= */

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  /* ================= REGISTER ================= */

  register() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        alert('Registered Successfully');
        this.goToLogin();
      },
      error: () => (this.error = 'Registration failed'),
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
