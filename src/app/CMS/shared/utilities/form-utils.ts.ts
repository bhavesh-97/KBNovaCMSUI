import { FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { ValidationRules } from "./validation-rules.enum";
import { ElementRef, Renderer2 } from '@angular/core';

export class FormUtils {
  // Map validation rules to regex patterns
  private static regexMap: Record<ValidationRules, RegExp> = {
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

  // Create FormGroup based on form field configurations
  static createFormGroup(formFields: FormFieldConfig[], fb: FormBuilder): FormGroup {
    const controlsConfig: { [key: string]: any } = {};
    formFields.forEach((field) => {
      controlsConfig[field.name] = ['', field.isMandatory ? [this.getValidator(field.events?.[0]?.validationRule)] : []];
    });
    
    return fb.group(controlsConfig);
  }
  // Register event listeners for form fields
  static registerFormFieldEventListeners(formFields: FormFieldConfig[], elementRefs: ElementRef[], renderer: Renderer2): void {
    formFields.forEach((field, index) => {
      const element = elementRefs[index]?.nativeElement as HTMLInputElement;
      if (element) {
        field.events?.forEach((event) => {
          renderer.listen(element, event.type, (e: Event) =>
            this.handleEvent(e, event.validationRule, element, renderer)
          );
        });
      }
    });
  }

  // Handle individual events
   static handleEvent(event: Event, rule: ValidationRules, element: HTMLInputElement, renderer: Renderer2): void {
    const regex = this.regexMap[rule];
    if (!regex) return;

    if (event.type === 'keypress') {
            debugger;
      const char = (event as KeyboardEvent).key;
      if (!regex.test(char)) {
        event.preventDefault();
      }
    }

    if (event.type === 'focusout') {
      const isValid = regex.test(element.value);
      if (!isValid) {
        renderer.addClass(element, 'invalid-input');
        const wrapDiv = element.closest('.wrap-input100') as HTMLElement;
        if (wrapDiv) {
          renderer.addClass(wrapDiv, 'alert-validate');
        }
      } else {
        renderer.removeClass(element, 'invalid-input');
        const wrapDiv = element.closest('.wrap-input100') as HTMLElement;
        if (wrapDiv) {
          renderer.removeClass(wrapDiv, 'alert-validate');
        }
      }
    }
  }
  
  // Update validation rule for a specific element
  static updateValidationRule(element: HTMLInputElement, isMandatory: boolean, renderer: Renderer2, events?: { type: string; validationRule: ValidationRules }[], formControl?: any): void {
    // Update mandatory status via validator
    if (formControl) {
      const validator = isMandatory && events?.[0]?.validationRule ? this.getValidator(events[0].validationRule) : null;
      formControl.setValidators(validator ? [validator] : []);
      formControl.updateValueAndValidity();
    }

    // Apply new validation rule using the first event's rule if events are provided
    if (events && events.length > 0) {
      renderer.listen(element, 'keypress', (e: Event) =>
        this.handleEvent(e, events[0].validationRule, element, renderer)
      );
      renderer.listen(element, 'focusout', (e: Event) =>
        this.handleEvent(e, events[0].validationRule, element, renderer)
      );
    }
  }
  static updateField(control: any, isMandatory: boolean, events?: { type: string; validationRule: ValidationRules }[]): void {
    // Update mandatory status via validator
    const validator = isMandatory && events?.[0]?.validationRule ? this.getValidator(events[0].validationRule) : null;
    control.setValidators(validator ? [validator] : []);
    control.updateValueAndValidity();
  }
  // Get ValidatorFn based on validation rule
  static getValidator(rule: ValidationRules | undefined): ValidatorFn {
    if (!rule) return () => null;
    return (control) => {
      const regex = this.regexMap[rule];
      return regex.test(control.value) ? null : { [rule]: true };
    };
  }
}

// Interface for form field configuration
export interface FormFieldConfig {
  name: string;
  isMandatory?: boolean;
  events?: { type: string; validationRule: ValidationRules }[];
}