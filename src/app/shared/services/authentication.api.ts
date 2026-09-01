import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpContext} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CreateUserRequest} from "../../features/authentication/models/endpoints/create-user.endpoint";
import {LoginUserRequest, LoginUserResponse} from "../../features/authentication/models/endpoints/login-user.endpoint";
import {environment} from "../../../environments/environment";
import {UserUpdateContainer} from "../../features/authentication/models/endpoints/user-update-container.model";
import {
  GetOrganizationAndCountryResponse
} from "../../features/authentication/models/endpoints/get-user-organization-and-country.endpoint";
import {SKIP_INTERCEPTOR} from "../validators/async-validators/skip-interceptor.token";
import {AUTH_ENDPOINTS} from "../../../environments/endpoints";

@Injectable({providedIn: 'root'})
export class AuthenticationApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

//******************************
//*** AUTH - LOGIN
//******************************

  login(loginUserRequest: LoginUserRequest): Observable<LoginUserResponse> {
    return this.http
      .post<LoginUserResponse>(
        this.baseUrl + AUTH_ENDPOINTS.login(),
        loginUserRequest
      );
  }

//*****************************
//*** USER PROFILE => To be implemented
//*****************************

  updateUserAccount(userUpdateContainer:UserUpdateContainer): Observable<any> {
    return this.http.put(
      this.baseUrl + AUTH_ENDPOINTS.update(),
      userUpdateContainer
    );
  }

  updateUserAccountPassword(userUpdateContainer:UserUpdateContainer): Observable<any> {
    return this.http.put(
      this.baseUrl + AUTH_ENDPOINTS.updatePassword(),
      userUpdateContainer
    );
  }

//******************************
//*** AUTH - REGISTER
//******************************

  register(createUserRequest: CreateUserRequest): Observable<void> {
    return this.http.post<void>(
      this.baseUrl + AUTH_ENDPOINTS.register(),
      createUserRequest
    );
  }

  getOrganizationAndCountry(registerCode: string): Observable<GetOrganizationAndCountryResponse> {
    // Context so interceptor ignores it
    const context = new HttpContext().set(SKIP_INTERCEPTOR, true);

    return this.http.get<GetOrganizationAndCountryResponse>(
      this.baseUrl + AUTH_ENDPOINTS.getOrganizationAndCountry(registerCode),
      {context}
    );
  }
}
