import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class CustomValidators {

  // TYPE => cross field validator
  // CONDITION => values are different
  // RETURNS => passwordMismatch error on second control
  static passwordsShouldMatch(passwordControlNameOne: string, confirmPasswordControlNameTwo:string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {

      const passwordControl = formGroup.get(passwordControlNameOne);
      const confirmPasswordControl = formGroup.get(confirmPasswordControlNameTwo);
      const error = { passwordMismatch : true };

      const password = passwordControl?.value;
      const confirmPassword = confirmPasswordControl?.value;

      // Check if there are prior errors AND mismatch error is not on the control
      if (confirmPasswordControl?.errors && !confirmPasswordControl.hasError("passwordMismatch")) {
        return null;
      }
      
      if (password != confirmPassword) {
        confirmPasswordControl?.setErrors(error);
      } else {
        confirmPasswordControl?.setErrors(null);
      }

      return null;
    }
  }

  // TYPE => cross field validator
  // CONDITION => if both values are "" (empty string)
  // RETURNS => atLeastOne error on both controls
  // It doesn't check for any prior errors. It assumes the controls have no other validators
  static atLeastOneControlRequired (controlNameOne:string, controlNameTwo:string): ValidatorFn {
    return (formGroup: AbstractControl) : ValidationErrors | null =>  {
      const controlOne = formGroup.get(controlNameOne);
      const controlTwo = formGroup.get(controlNameTwo);
      const error = { atLeastOne: true };

      const valueOne = controlOne?.value;
      const valueTwo = controlTwo?.value;

      if (valueOne === "" && valueTwo === "") {
        controlOne?.setErrors(error);
        controlTwo?.setErrors(error);
      } else {
        controlOne?.setErrors(null);
        controlTwo?.setErrors(null);
      }
      return null;
    }
  }

  /**
   * @deprecated This method is deprecated. Use `atLeastOneTrueOutOf()` instead.
   * This method does something important but has been replaced by a better implementation.
  */
  // TYPE => cross field validator
  // CONDITION => if all values are false
  // RETURNS => atLeastOneOutOfThreeTrue error on form group
  // It doesn't check for any prior errors. It assumes the controls have no other validators
  static atLeastOneOutOfThreeTrue (controlNameOne:string, controlNameTwo:string, controlNameThree:string): ValidatorFn {
    return (formGroup: AbstractControl) : ValidationErrors | null =>  {
      const valueOne = formGroup.get(controlNameOne)?.value;
      const valueTwo = formGroup.get(controlNameTwo)?.value;
      const valueThree = formGroup.get(controlNameThree)?.value;
      const error = { atLeastOneOutOfThreeTrue: true };
      
      // Error if all three applicableDamages are false
      if (!valueOne && !valueTwo && !valueThree) {
        return error;
      } else {
        return null;
      }  
    }
  }

  /**
   * @deprecated This method is deprecated. Use `atLeastOneTrueOutOf()` instead.
   * This method does something important but has been replaced by a better implementation.
  */
  // TYPE => cross field validator
  // CONDITION => if all values are false
  // RETURNS => atLeastOneOutOfFourTrue error on form group
  // It doesn't check for any prior errors. It assumes the controls have no other validators
  static atLeastOneOutOfFourTrue (
    controlNameOne:string, 
    controlNameTwo:string, 
    controlNameThree:string,
    controlNameFour:string
    ): ValidatorFn {

    return (formGroup: AbstractControl) : ValidationErrors | null =>  {
      const valueOne = formGroup.get(controlNameOne)?.value;
      const valueTwo = formGroup.get(controlNameTwo)?.value;
      const valueThree = formGroup.get(controlNameThree)?.value;
      const valueFour = formGroup.get(controlNameFour)?.value;
      const error = { atLeastOneOutOfFourTrue: true };
      
      // Error if all three applicableDamages are false
      if (!valueOne && !valueTwo && !valueThree && !valueFour) {
        return error;
      } else {
        return null;
      }  
    }
  }

  // TYPE => cross field validator
  // CONDITION => if all values are false
  // RETURNS => atLeastOneTrueError error on form group
  // It doesn't check for any prior errors. It assumes the controls have no other validators
  static atLeastOneTrueOutOf(...controlNames: string[]): ValidatorFn {
    return (formGroup: AbstractControl) : ValidationErrors | null =>  {
      const error = { atLeastOneTrueError: true };

      // Use .some() to check if at least one control has a value of true
      const atLeastOneIsTrue: boolean = controlNames.some(controlName => formGroup.get(controlName)?.value);

      return atLeastOneIsTrue 
        ? null
        : error;
    }
  }
}