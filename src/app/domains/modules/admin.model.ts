export interface Admin {
  admin_id: number;
  admin_login: string;
  admin_password_hash?: string;
  is_active_admin: boolean;
  admin_birth_date: string | null;
  created_at: string;
}

export interface AdminCreateIn {
  admin_login: string;
  admin_password: string;
  is_active_admin?: boolean;
  admin_birth_date?: string;
}

export interface AdminUpdateIn {
  admin_login?: string;
  is_active_admin?: boolean;
  admin_birth_date?: string;
}