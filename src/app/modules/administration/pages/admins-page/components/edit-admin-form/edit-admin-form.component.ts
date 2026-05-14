import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Admin, AdminUpdateIn } from '../../../../../../domains/modules/admin.model';
import { AdminService } from '../../../../../../domains/services/admin.service';

@Component({
  selector: 'app-edit-admin-form',
  templateUrl: './edit-admin-form.component.html',
  styleUrls: ['./edit-admin-form.component.css']
})
export class EditAdminFormComponent implements OnInit, OnChanges {
  @Input() selectedAdmin: Admin | null = null;
  @Output() adminUpdated = new EventEmitter<{ admin_id: number; updates: any }>();

  editAdminForm: FormGroup;

  constructor(private fb: FormBuilder, private adminService: AdminService) {
    this.editAdminForm = this.fb.group({
      admin_login: ['', [Validators.required, Validators.minLength(2)]],
      admin_password: ['', [Validators.minLength(6)]],
      is_active_admin: [false],
      admin_birth_date: ['']
    });
  }

  ngOnInit() {
    this.updateForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedAdmin'] && changes['selectedAdmin'].currentValue) {
      this.updateForm();
    }
  }

  updateForm() {
    if (this.selectedAdmin) {
      this.editAdminForm.patchValue({
        admin_login: this.selectedAdmin.admin_login,
        is_active_admin: !!this.selectedAdmin.is_active_admin,
        admin_birth_date: this.formatDate(this.selectedAdmin.admin_birth_date)
      });
    }
  }

  onSubmit() {
    if (this.editAdminForm.valid && this.selectedAdmin) {
      const passwordValue = this.editAdminForm.get('admin_password')?.value;
      const updateData: any = {
        admin_login: this.editAdminForm.get('admin_login')?.value,
        is_active_admin: !!this.editAdminForm.get('is_active_admin')?.value,
        admin_birth_date: this.editAdminForm.get('admin_birth_date')?.value || undefined
      };
      if (passwordValue) {
        updateData.admin_password = passwordValue;
      }
      const adminId = this.selectedAdmin.admin_id;
      this.adminService.updateAdmin(adminId, updateData).subscribe({
        next: () => {
          this.adminUpdated.emit({ admin_id: adminId, updates: updateData });
        }
      });
    }
  }

  formatDate(date: string | null | undefined): string {
    if (!date) return '';
    return date.split('T')[0].split(' ')[0];
  }
}
