import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Admin, AdminCreateIn, AdminUpdateIn } from "../modules/admin.model";

// Additional request/response shapes based on OpenAPI where project doesn't yet have TS models
export interface AdminSignInIn {
  admin_login: string;
  admin_password: string;
}

export interface AdminSignOutIn {
  admin_id: number;
}

export interface AdminAssignRoleIn {
  admin_id: number;
  role_id: number;
}

export interface AdminRole {
  role_id: number;
  role_name?: string;
}

@Injectable({
  providedIn: "root",
})
export class AdminService {
  private apiUrl = "/api/admins";
  private rolesUrl = "/api/admin-roles";

  constructor(private http: HttpClient) {}

  // Admins CRUD
  getAdmins(
    includeInactive = false,
    limit = 50,
    offset = 0,
  ): Observable<{ ok: boolean; admins: Admin[] }> {
    const params = new HttpParams()
      .set("include_inactive", includeInactive.toString())
      .set("limit", String(limit))
      .set("offset", String(offset));
    return this.http.get<{ ok: boolean; admins: Admin[] }>(this.apiUrl, {
      params,
    });
  }

  getAdminById(adminId: number): Observable<Admin> {
    return this.http.get<Admin>(`${this.apiUrl}/${adminId}`);
  }

  createAdmin(admin: AdminCreateIn): Observable<{ ok: boolean; admin: Admin }> {
    return this.http.post<{ ok: boolean; admin: Admin }>(this.apiUrl, admin);
  }

  updateAdmin(
    adminId: number,
    admin: AdminUpdateIn,
  ): Observable<{ ok: boolean; admin: Admin }> {
    return this.http.patch<{ ok: boolean; admin: Admin }>(
      `${this.apiUrl}/${adminId}`,
      admin,
    );
  }

  deleteAdmin(
    adminId: number,
    hard = false,
  ): Observable<{ ok: boolean; deleted: boolean }> {
    const params = new HttpParams().set("hard", hard.toString());
    return this.http.delete<{ ok: boolean; deleted: boolean }>(
      `${this.apiUrl}/${adminId}`,
      { params },
    );
  }

  // Auth endpoints
  signIn(payload: AdminSignInIn): Observable<any> {
    // OpenAPI doesn't define exact response shape for sign in in the provided fragment.
    // Return typed as any so callers can handle token/session as needed.
    return this.http.post<any>(`${this.apiUrl}/admin_sign_in`, payload);
  }

  signOut(payload: AdminSignOutIn): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin_sign_out`, payload);
  }

  getCurrentAdmin(xAdminId?: number | null): Observable<Admin> {
    const headers =
      xAdminId != null
        ? new HttpHeaders({ "x-admin-id": String(xAdminId) })
        : undefined;
    return this.http.get<Admin>(`${this.apiUrl}/get_current_admin`, {
      headers,
    });
  }

  // Admin roles
  getAdminRoles(
    limit = 50,
    offset = 0,
  ): Observable<{ ok: boolean; roles: AdminRole[] }> {
    const params = new HttpParams()
      .set("limit", String(limit))
      .set("offset", String(offset));
    return this.http.get<{ ok: boolean; roles: AdminRole[] }>(this.rolesUrl, {
      params,
    });
  }

  assignRoleToAdmin(payload: AdminAssignRoleIn): Observable<any> {
    return this.http.post<any>(
      `${this.rolesUrl}/assign_role_to_admin`,
      payload,
    );
  }
}
