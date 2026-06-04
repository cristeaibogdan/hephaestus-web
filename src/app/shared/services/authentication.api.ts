import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetOrganizationAndCountryResponse } from 'src/app/features/washing-machine/models/endpoints/get-user-organization-and-country.endpoint';
import { UserUpdateContainer } from 'src/app/features/washing-machine/models/user-update-container.model';
import { SKIP_INTERCEPTOR } from 'src/app/shared/validators/async-validators/skip-interceptor.token';
import {CreateUserRequest} from "../../features/authentication/models/endpoints/create-user.endpoint";
import {LoginUserRequest, LoginUserResponse} from "../../features/authentication/models/endpoints/login-user.endpoint";

@Injectable({providedIn: 'root'})
export class AuthenticationApi {
  apiURL = environment.apiBaseUrl;
  private http = inject(HttpClient);

//******************************
//*** AUTH - LOGIN
//******************************

  login(loginUserRequest: LoginUserRequest): Observable<LoginUserResponse> {
    const url = this.apiURL.concat("/api/v1/users/login");
    const payload = loginUserRequest;
    return this.http
      .post<LoginUserResponse>(url, payload);
  }

//*****************************
//*** USER PROFILE => To be implemented
//*****************************

  updateUserAccount(userUpdateContainer:UserUpdateContainer): Observable<any> {
    const url = this.apiURL.concat("/auth/update");
    const payload = userUpdateContainer
    return this.http.put(url, payload);
  }

  updateUserAccountPassword(userUpdateContainer:UserUpdateContainer): Observable<any> {
    const url = this.apiURL.concat("/auth/password");
    const payload = userUpdateContainer
    return this.http.put(url, payload);
  }

//******************************
//*** AUTH - REGISTER
//******************************

  register(createUserRequest: CreateUserRequest): Observable<void> {
    const url = this.apiURL.concat("/api/v1/users/register");
    const payload = createUserRequest;

    return this.http
      .post<void>(url, payload);
  }

  getOrganizationAndCountry(registerCode: string): Observable<GetOrganizationAndCountryResponse> {
    const url = this.apiURL.concat("/api/v1/users/")
      .concat(registerCode)
      .concat("/organization-and-country");

    // Context so interceptor ignores it
    const context = new HttpContext().set(SKIP_INTERCEPTOR, true);

    return this.http
      .get<GetOrganizationAndCountryResponse>(url, {context});
  }
}
