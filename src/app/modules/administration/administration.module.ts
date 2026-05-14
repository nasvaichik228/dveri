import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UsersPageComponent } from "./pages/users-page/users-page.component";
import { AdminPageComponent } from "./pages/admin-page/admin-page.component";
import { AdminsPageComponent } from "./pages/admins-page/admins-page.component";
import { AdministrationRoutingModule } from "./administration-routing";
import { FormsModule } from "@angular/forms";
import { RizhiComponentComponent } from "./pages/users-page/component/rizhi-component/rizhi-component.component";
import { AddUserFormComponent } from "./pages/users-page/components/add-user-form/add-user-form.component";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../../domains/modules/shared/shared.module";
import { EditUserComponent } from "./pages/users-page/components/edit-user/edit-user.component";
import { AddAdminFormComponent } from "./pages/admins-page/components/add-admin-form/add-admin-form.component";
import { EditAdminFormComponent } from "./pages/admins-page/components/edit-admin-form/edit-admin-form.component";

@NgModule({
  declarations: [
    AdminPageComponent,
    UsersPageComponent,
    AdminsPageComponent,
    RizhiComponentComponent,
    AddUserFormComponent,
    EditUserComponent,
    AddAdminFormComponent,
    EditAdminFormComponent,
  ],

  imports: [
    AdministrationRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class AdministrationModule {}
