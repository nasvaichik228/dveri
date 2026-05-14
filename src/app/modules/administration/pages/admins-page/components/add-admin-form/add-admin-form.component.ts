import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../../../../domains/services/admin.service';

@Component({
  selector: 'app-add-admin-form',
  templateUrl: './add-admin-form.component.html',
  styleUrls: ['./add-admin-form.component.css']
})
export class AddAdminFormComponent implements OnInit {

  @Output() adminAdded = new EventEmitter<void>();

  addAdminForm: FormGroup = new FormGroup({});

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.initAddAdminForm();
  }

  initAddAdminForm(): void {
    this.addAdminForm = new FormGroup({
      admin_login: new FormControl('', [Validators.required, Validators.minLength(2)]),
      admin_password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      is_active_admin: new FormControl(false)
    });
  }

  addNewAdmin() {
    if (this.addAdminForm.invalid) {
      this.addAdminForm.markAllAsTouched();
      return;
    }

    this.adminService.createAdmin({
      admin_login: this.addAdminForm.get('admin_login')?.value,
      admin_password: this.addAdminForm.get('admin_password')?.value,
      is_active_admin: this.addAdminForm.get('is_active_admin')?.value
    }).subscribe({
      next: () => {
        this.addAdminForm.reset({ is_active_admin: false });
        this.adminAdded.emit();
      }
    });
  }

  getFieldErrors(fieldName: string) {
    const field = this.addAdminForm.get(fieldName);
    if (field?.touched && field?.invalid) {
      return field.errors;
    }
    return null;
  }
}
