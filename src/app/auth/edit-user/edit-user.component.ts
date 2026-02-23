import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent {
  profileForm!: FormGroup;
  editMode = false;
  originalData: any;

  constructor(
    private fb: FormBuilder,
    private userService: AuthService,
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      username: [''],
      fullName: [''],
      email: [''],
      phone: [''],
      role: [''],
      password: [''],
    });

    this.loadProfile();
  }

  loadProfile() {
    // this.userService.getProfile().subscribe((res) => {
    //   this.profileForm.patchValue(res);
    //   this.originalData = res;
    // });
  }

  enableEdit() {
    this.editMode = true;
  }

  cancel() {
    this.profileForm.patchValue(this.originalData);
    this.editMode = false;
  }

  save() {
    // this.userService.updateProfile(this.profileForm.value).subscribe(() => {
    //   this.editMode = false;
    //   this.loadProfile();
    //   alert('Profile updated successfully');
    // });
  }
}
