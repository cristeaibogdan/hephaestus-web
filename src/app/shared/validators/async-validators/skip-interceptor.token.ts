import { HttpContextToken } from "@angular/common/http";

// Token used to mark HTTP requests that should bypass interceptors
export const SKIP_INTERCEPTOR = new HttpContextToken<boolean>(() => false);