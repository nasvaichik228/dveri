import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminPageComponent } from "./pages/admin-page/admin-page.component";
import { UsersPageComponent } from "./pages/users-page/users-page.component";
import { AdminsPageComponent } from "./pages/admins-page/admins-page.component";

const routes: Routes = [
  {
    path: "",
    component: AdminPageComponent,
  },
  {
    path: "users",
    component: UsersPageComponent,
  },
  {
    path: "admins",
    component: AdminsPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrationRoutingModule {}
