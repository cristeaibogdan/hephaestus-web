import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators, NonNullableFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RegisterCodeValidator } from 'src/app/shared/validators/async-validators/register-code.validator';
import { TranslateService } from '@ngx-translate/core';
import { CustomValidators } from '../../shared/validators/custom.validators';
import { AuthDataService } from 'src/app/services/auth.data.service';
import { NotificationService } from 'src/app/services/notification.service';
import { CreateUserRequest } from 'src/app/washing-machine/models/dtos/create-user-request.dto';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  constructor(
    private fb: NonNullableFormBuilder, 
    private router: Router,
    private _translate:TranslateService,
    private _authDataService: AuthDataService,
    private _notifService: NotificationService,
    private registerCodeValidator:RegisterCodeValidator
  ) {}

  private codeSubscription!:Subscription;

  registerForm = this.fb.group({
    code: ["", {
      validators: [Validators.required],
      asyncValidators: [this.registerCodeValidator.validate.bind(this.registerCodeValidator)],
      updateOn: "blur"
    }],

    organization: [{value:"", disabled:true}],
    country: [{value:"", disabled:true}],
    email: ["", [Validators.required, Validators.email]],
    username: ["", Validators.required],
    password: ["", [Validators.required, Validators.minLength(6)]],
    confirmPassword: ["", Validators.required]
  }, {validators: CustomValidators.passwordsShouldMatch("password", "confirmPassword")});

  ngOnInit() {
    // Subscribe to registerCode statusChanges and call a HTTP method to retrieve values from BACKEND
    this.codeSubscription = this.registerForm.controls.code.statusChanges.subscribe((status) => {
      if (status === "VALID") {
        this._authDataService.getOrganizationAndCountry(this.registerForm.controls.code.value.toString()).subscribe(organizationAndCountry => {
          this.registerForm.patchValue(organizationAndCountry);
        });
      } else {
        this.registerForm.controls.organization.reset();
        this.registerForm.controls.country.reset();
      }
    });
  }

  ngOnDestroy() {
    this.codeSubscription.unsubscribe();
  }

// *****************************************
// *** REGISTER FUNCTIONALITY
// *****************************************

  onRegister() {
    if (this.registerForm.invalid || this.registerForm.pending) {
      return;
    }

    const userAccount: CreateUserRequest = {
      code: this.registerForm.controls.code.value.toString(),
      organization: this.registerForm.controls.organization.value,
      country: this.registerForm.controls.country.value,
      email: this.registerForm.controls.email.value,
      username: this.registerForm.controls.username.value,
      password: this.registerForm.controls.password.value
    };

    this._authDataService.register(userAccount).subscribe(() => {              
        this._notifService.showSuccess(this._translate.instant("I18N.CUSTOM_SUCCESS.ACCOUNT_CREATED"),0);
        this.goToLoginPage();
      }
    );
  }
  
  goToLoginPage() {
    this.router.navigate(["login"]);
  }
}
