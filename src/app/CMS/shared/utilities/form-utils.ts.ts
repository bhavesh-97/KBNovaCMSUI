import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { ValidationRules } from "./validation-rules.enum";
import { ElementRef, inject, Injectable, Renderer2 } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { FormFieldConfig } from '../../Interfaces/FormFieldConfig';
import { PopupMessageType } from '../../models/PopupMessageType';
import { JsonResponseModel } from '../../models/JsonResponseModel';
@Injectable({
  providedIn: 'root'
})
export class FormUtils {
  public notificationService = inject(NotificationService);

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
    [ValidationRules.MobileNoWithSeries]: /^[6-9]\d{9}$/,                                  // e.g., 1234567890
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
  public createFormGroup(formFields: FormFieldConfig[], fb: FormBuilder): FormGroup {
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
  public registerFormFieldEventListeners(
    formFields: FormFieldConfig[],
    elementRefs: ElementRef[],
    renderer: Renderer2,
    formGroup: FormGroup
  ): void {
    formFields.forEach((field, index) => {
      const element = elementRefs[index]?.nativeElement as HTMLInputElement;
        if (element) {
          field.events?.forEach(event => {
            this.attachEventListener(
                    element,
                    event.type,
                    (e: Event) => this.handleEvent(e, event.validationRule, element, renderer, field, formGroup.controls[field.name]),
                    renderer
                );
            });
          }
      });
  }

  // Handle individual events
  private handleEvent(
    event: Event,
    rule: ValidationRules,
    element: HTMLInputElement,
    renderer: Renderer2,
    field: FormFieldConfig,
    formControl: AbstractControl
  ): void {
    debugger
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
                this.notificationService.showMessage(`The ${field.name} field is required.`,'Validation Error',PopupMessageType.Error);  
                formControl.reset();   
             }
      } else if (!isValid && !isEmpty) {
        const hasValidEvents = field.events && field.events.length === 1 && field.events[0].type === 'focusout';
        const errorMessage =
          field.isMandatory && hasValidEvents && formControl?.errors?.[rule]?.validationMessage
            ? formControl.errors[rule].validationMessage
            : this.errorMessages[rule];

            if(field.isMandatory){
                this.notificationService.showMessage(errorMessage, 'Validation Error', PopupMessageType.Error);                     
                formControl.reset();
            }
      }
    }
  }
  
  // Attach Event Listener on element
  private attachEventListener(
    element: HTMLInputElement,
    eventType: string,
    handler: (event: any) => void,
    renderer: Renderer2
  ) {
    const attachedKey = `_attached_${eventType}`;
    if (!(element as any)[attachedKey]) {
      renderer.listen(element, eventType, handler);
      (element as any)[attachedKey] = true; 
    }
  }

  // Update validation rule for a specific element
  public updateValidationRule(
  element: HTMLInputElement,
  field: FormFieldConfig,
  isMandatory: boolean,
  renderer: Renderer2,
  formControl: AbstractControl
): void {
  if (!formControl || !field) return;
 debugger
  field.isMandatory = isMandatory;

  // 1️⃣ Update validators
  const validator = isMandatory && field.events?.[0]?.validationRule
    ? this.getValidator(field.events[0].validationRule, field.validationMessage, field.name)
    : null;

  formControl.setValidators(validator ? [validator] : []);
  formControl.updateValueAndValidity();

  
  field.events?.forEach(event => {
    this.attachEventListener(
      element,
      event.type,
      (e: any) => this.handleEvent(e, event.validationRule, element, renderer, field, formControl),
      renderer
    );
  });
  }
 
  // Get all form field data from FormGroup or plain object
  public getAllFormFieldData(
    formFields: FormFieldConfig[],
    formData: FormGroup | { [key: string]: any },
    elementRefs?: ElementRef[]
  ): { [key: string]: any } {
    const result: { [key: string]: any } = {};

    try {
      if (!formFields || !Array.isArray(formFields)) {
        this.notificationService.showMessage('Invalid or missing formFields array.', 'Validation Error', PopupMessageType.Error);
        return result;
      }

      if (!formData || typeof formData !== 'object') {
        this.notificationService.showMessage('Invalid or missing formData object.', 'Validation Error', PopupMessageType.Error);
        return result;
      }

      formFields.forEach((field, index) => {
        try {
          let value: any;
          const fieldName = field.name;
          const isReactiveForm = formData instanceof FormGroup;
          let element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null = null;

          if (elementRefs && elementRefs[index]) {
            element = elementRefs[index].nativeElement;
          }

          if (isReactiveForm) {
            const control = (formData as FormGroup).get(fieldName);
            value = control ? control.value : null;
          } else {
            value = (formData as { [key: string]: any })[fieldName] || null;
          }

          if (element && (!isReactiveForm || !value)) {
            const tagName = element.tagName.toLowerCase();
            const type = element.getAttribute('type')?.toLowerCase();

            if (tagName === 'input' && ['text', 'password', 'hidden', 'month', 'email', 'tel'].includes(type || '')) {
              value = element.value || null;
            } else if (tagName === 'textarea') {
              value = element.value || null;
            } else if (tagName === 'input' && type === 'radio') {
              if (elementRefs) {
                const radioElements = elementRefs.filter(
                  el => el.nativeElement.getAttribute('name') === fieldName && el.nativeElement.type === 'radio'
                );
                value = radioElements.find(el => (el.nativeElement as HTMLInputElement).checked)?.nativeElement.value || null;
              }
            } else if (tagName === 'input' && type === 'checkbox') {
              value = (element as HTMLInputElement).checked;
            } else if (tagName === 'input' && type === 'file') {
              value = (formData as { [key: string]: any })[fieldName] || null;
            } else if (tagName === 'select') {
              const isMultiple = element.hasAttribute('multiple');
              if (isMultiple) {
                value = Array.from((element as HTMLSelectElement).selectedOptions).map(option => option.value) || [];
              } else {
                value = (element as HTMLSelectElement).value || '0';
              }
            } else if (tagName === 'button' || (tagName === 'input' && ['button', 'submit'].includes(type || ''))) {
              value = element.value || element.textContent || '';
            }
          }

          result[fieldName] = value;
        } catch (fieldError) {
          this.notificationService.showMessage(
            `Error processing field with name: ${field.name}`,
            'Validation Error',
            PopupMessageType.Error
          );
        }
      });
    } catch (error) {
      this.notificationService.showMessage('Error in getAllFormFieldData function.', 'Validation Error', PopupMessageType.Error);
    }

    return result;
  }
  // Validate form fields based on configurations
  public validateFormFields(
    formFields: FormFieldConfig[],
    formData: FormGroup | { [key: string]: any },
    elementRefs?: ElementRef[],
    renderer?: Renderer2
  ): JsonResponseModel {
    const isReactiveForm = formData instanceof FormGroup;
    if (!formFields || !Array.isArray(formFields)) {
      return { isError: true, strMessage: 'Invalid or missing formFields array.', title: PopupMessageType.Error, type: PopupMessageType.Error };
    }

    if (!formData || typeof formData !== 'object') {
      return { isError: true, strMessage: 'Invalid or missing formData object.', title: PopupMessageType.Error, type: PopupMessageType.Error };
    }
    for (const [index, field] of formFields.entries()) {
      
debugger;
      const fieldName = field.name;
      const element = elementRefs?.[index]?.nativeElement as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
      const label = element?.previousElementSibling?.tagName.toLowerCase() === 'label'
        ? element.previousElementSibling.textContent?.replace(/\*/g, '').trim() || fieldName.replace(/([A-Z])/g, ' $1').trim()
        : fieldName.replace(/([A-Z])/g, ' $1').trim();
      let fieldValue: any;
      let control: AbstractControl | null = null;

      if (isReactiveForm) {
        control = (formData as FormGroup).get(fieldName);
        fieldValue = control ? control.value : null;
      } else {
        fieldValue = (formData as { [key: string]: any })[fieldName] || null;
      }

      if (field.isMandatory) {
        debugger
        if (element?.getAttribute('type')?.toLowerCase() === 'file') {
          if (!fieldValue || (typeof fieldValue === 'object' && !fieldValue.FilePath) && !(fieldValue?.FilePath?.includes('CouchDB'))) {
            const msg = `${label} is required and cannot be empty.`;
            
            console.log(msg);
            return { isError: true, strMessage: msg, title: PopupMessageType.Error, type: PopupMessageType.Error };
          }
        } else if (element?.getAttribute('type')?.toLowerCase() === 'radio') {
          if (elementRefs && !elementRefs.filter(el => el.nativeElement.getAttribute('name') === fieldName && el.nativeElement.type === 'radio')
            .find(el => (el.nativeElement as HTMLInputElement).checked)) {
            const msg = `Please select a valid ${label}.`;
            return { isError: true, strMessage: msg, title: PopupMessageType.Error, type: PopupMessageType.Error };
          }
        } else if (element?.getAttribute('type')?.toLowerCase() === 'checkbox') {
          if (!(element as HTMLInputElement).checked) {
            const msg = `Please check the ${label}.`;
            return { isError: true, strMessage: msg, title: PopupMessageType.Error, type: PopupMessageType.Error };
          }
        } else if (element?.tagName.toLowerCase() === 'select') {
          const value = (element as HTMLSelectElement).value;
          if (!value || value === '0') {
            const msg = `Please select a valid ${label}.`;
            return { isError: true, strMessage: msg, title: PopupMessageType.Error, type: PopupMessageType.Error };
          }
        } else if (!fieldValue) {
          const msg = `${label} is required and cannot be empty.`;
          if (element && renderer) {
            renderer.selectRootElement(element).focus();
          }
          return { isError: true, strMessage: msg, title: PopupMessageType.Error, type: PopupMessageType.Error };
        }
      }

      if (field.events?.length && fieldValue && isReactiveForm && control) {
        for (const event of field.events) {
          if (event.validationRule && this.regexMap[event.validationRule] && !this.regexMap[event.validationRule].test(fieldValue)) {
            const msg = field.validationMessage || `Please enter a valid ${label}.`;
            
            console.log(msg);
            return { isError: true, strMessage: msg, title: PopupMessageType.Error, type: PopupMessageType.Error };
          }
        }
      }
    }

    if (isReactiveForm) (formData as FormGroup).markAllAsTouched();
    return { isError: false, strMessage: '', title: PopupMessageType.Success, type: PopupMessageType.Success };
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

