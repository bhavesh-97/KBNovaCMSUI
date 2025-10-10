import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { ValidationRules } from "./validation-rules.enum";
import { ElementRef, inject, Injectable, Renderer2 } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
@Injectable({
  providedIn: 'root'
})
export class FormUtils {
  public notificationService = inject(NotificationService);

  private listeners: { [key: string]: () => void } = {};
  // Map validation rules to regex patterns
  public regexMap: Record<ValidationRules, RegExp> = {
    [ValidationRules.AlphanumericOnly]: /^[a-zA-Z0-9]*$/,                                  // e.g., abc123
    [ValidationRules.NumberOnly]: /^[0-9]*$/,                                              // e.g., 12345
    [ValidationRules.LettersOnly]: /^[a-zA-Z]*$/,                                          // e.g., abc
    [ValidationRules.LettersWithWhiteSpace]: /^[a-zA-Z\s]*$/,                              // e.g., John Doe
    [ValidationRules.DecimalOnly]: /^\d*\.?\d*$/,                                          // e.g., 123.45
    [ValidationRules.EmailID]: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,                          // e.g., user@example.com
    [ValidationRules.Pincode]: /^[1-9][0-9]{5}$/,                                          // e.g., 123456
    [ValidationRules.IFSCCode]: /^[A-Z]{4}0[A-Z0-9]{6}$/,                                  // e.g., ABCD0123456
    [ValidationRules.Address]: /^[a-zA-Z0-9\s,.-]*$/,                                      // e.g., 123 Main St, City
    [ValidationRules.MobileNoWithSeries]: /^[0-9]*$/,                                      // e.g., 1234567890
    [ValidationRules.AgeAbove18Years]: /^[0-9]*$/,                                         // e.g., 25
    [ValidationRules.AccountNumber]: /^[0-9]*$/,                                           // e.g., 1234567890
    [ValidationRules.HouseOrSurveyNumber]: /^[a-zA-Z0-9/-]*$/,                             // e.g., H-123 or 12/34
    [ValidationRules.PasswordStrength]: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,  // e.g., Pass1234
    [ValidationRules.MobileWithCountryCode]: /^\+[1-9]\d{1,14}$/,                          // e.g., +123456789012
    [ValidationRules.NoSpecialChars]: /^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]*$/,          // e.g., abc123
  };

    // Default error messages for validation rules
  private errorMessages: Record<ValidationRules, string> = {
    [ValidationRules.AlphanumericOnly]: 'Only alphanumeric characters are allowed.',
    [ValidationRules.NumberOnly]: 'Only numbers are allowed.',
    [ValidationRules.LettersOnly]: 'Only letters are allowed.',
    [ValidationRules.LettersWithWhiteSpace]: 'Only letters and spaces are allowed.',
    [ValidationRules.DecimalOnly]: 'Enter a valid decimal number.',
    [ValidationRules.EmailID]: 'Please enter a valid email address.',
    [ValidationRules.Pincode]: 'Enter a valid 6-digit pincode.',
    [ValidationRules.IFSCCode]: 'Enter a valid IFSC code (e.g., ABCD0123456).',
    [ValidationRules.Address]: 'Enter a valid address with letters, numbers, and basic punctuation.',
    [ValidationRules.MobileNoWithSeries]: 'Enter a valid mobile number.',
    [ValidationRules.AgeAbove18Years]: 'Enter a valid age (numbers only).',
    [ValidationRules.AccountNumber]: 'Enter a valid account number.',
    [ValidationRules.HouseOrSurveyNumber]: 'Enter a valid house or survey number.',
    [ValidationRules.PasswordStrength]: 'Password must be at least 8 characters long with an uppercase letter, lowercase letter, and number.',
    [ValidationRules.MobileWithCountryCode]: 'Enter a valid mobile number with country code (e.g., +1234567890).',
    [ValidationRules.NoSpecialChars]: 'Special characters are not allowed.',
  };

 // Create FormGroup based on form field configurations
  createFormGroup(formFields: FormFieldConfig[], fb: FormBuilder): FormGroup {
    const controlsConfig: { [key: string]: any } = {};
    formFields.forEach((field) => {
      const validators: ValidatorFn[] = [];
      if (field.isMandatory && field?.events?.[0]?.validationRule) {
        validators.push(this.getValidator(field.events[0].validationRule, field.validationMessage, field.name));
      }
      controlsConfig[field.name] = ['', validators];
    });
    return fb.group(controlsConfig);
  }

  // Register event listeners for form fields
  registerFormFieldEventListeners(
    formFields: FormFieldConfig[],
    elementRefs: ElementRef[],
    renderer: Renderer2,
    formGroup: FormGroup
  ): void {
    formFields.forEach((field, index) => {
      const element = elementRefs[index]?.nativeElement as HTMLInputElement;
      if (element) {
        field.events?.forEach((event) => {
          renderer.listen(element, event.type, (e: Event) => {
            if (e.type === event.type) {
              this.handleEvent(e, event.validationRule, element, renderer, field, formGroup.controls[field.name]);
            }
          });
        });
      }
    });
  }

    // Handle individual events
  handleEvent(
    event: Event,
    rule: ValidationRules,
    element: HTMLInputElement,
    renderer: Renderer2,
    field: FormFieldConfig,
    formControl: AbstractControl
  ): void {
    const regex = this.regexMap[rule];
    if (!regex) return;
    if (event.type === 'keypress') {
      console.log(event);
      const char = (event as KeyboardEvent).key;
      if (!regex.test(char)) {   
        event.preventDefault(); 
      }
    }

    if (event.type === 'focusout') {
      const isEmpty = !element.value;
      const isValid = regex.test(element.value);
debugger;
      if (field.isMandatory && isEmpty) {
            if(field.isMandatory){
                this.notificationService.showMessage(`The ${field.name} field is required.`,'Validation Error','error');  
                formControl.reset();   
             }
      } else if (!isValid && !isEmpty) {
        const hasValidEvents = field.events && field.events.length === 1 && field.events[0].type === 'focusout';
        const errorMessage =
          field.isMandatory && hasValidEvents && formControl?.errors?.[rule]?.validationMessage
            ? formControl.errors[rule].validationMessage
            : this.errorMessages[rule];

            if(field.isMandatory){
                this.notificationService.showMessage(errorMessage, 'Validation Error', 'error');                     
                formControl.reset();
            }
      }
    }
  }


  // Update validation rule for a specific element
  updateValidationRule(
    element: HTMLInputElement,
    field: FormFieldConfig,
    isMandatory: boolean,
    renderer: Renderer2,
    formControl: AbstractControl
  ): void {
    if (formControl && field) {
      const validator = isMandatory && field.events?.[0]?.validationRule
        ? this.getValidator(field.events[0].validationRule, field.validationMessage, field.name)
        : null;
      formControl.setValidators(validator ? [validator] : []);
      formControl.updateValueAndValidity();
    }
  }


 // Get ValidatorFn based on validation rule
  private getValidator(rule: ValidationRules | undefined, customMessage?: string, fieldName?: string): ValidatorFn {
    if (!rule) return () => null;
    return (control: AbstractControl) => {
      const regex = this.regexMap[rule];
      if (!regex.test(control.value)) {
        // Attach custom message for mandatory fields with valid events
        return { [rule]: { valid: false, message: customMessage || this.errorMessages[rule] } };
      }
      return null;
    };
  }
}

// Interface for form field configuration
export interface FormFieldConfig {
  name: string;
  isMandatory?: boolean;
  validationMessage?: string;
  events?: { type: string; validationRule: ValidationRules }[];
}