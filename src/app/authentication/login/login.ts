import { Component, AfterViewInit, inject, ElementRef,ViewChild, QueryList, ViewChildren,Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { gsap } from 'gsap';
import { SharedImports } from '../../shared/imports/shared-imports';
import { FormUtils } from '../../shared/utilities/form-utils.ts.js';
import { FormFieldConfig } from '../../Interfaces/FormFieldConfig.js';
import { ValidationRules } from '../../shared/utilities/validation-rules.enum.js';
import { NotificationService } from '../../services/notification.service.js';
import { MUserLogin } from '../../models/MUserLogin.js';
import { LoginService } from './login.service.js';
import { PopupMessageType } from '../../models/PopupMessageType.js';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [...SharedImports, TooltipModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements AfterViewInit {
  @ViewChild('tiltContainer', { static: false }) tiltContainer!: ElementRef<HTMLDivElement>;
  @ViewChildren('inputField') inputElements!: QueryList<ElementRef>;
  public notificationService = inject(NotificationService);

  private fb = inject(FormBuilder);
  private renderer = inject(Renderer2);
  private FormUtils = inject(FormUtils);
  private loginService = inject(LoginService);

  loginForm: FormGroup;
  emailShowError = false;
  passwordShowError = false;
  showPassword = false; 
  showEmail = true;


  // Form field configurations
  private formFields: FormFieldConfig[] = [
    { name: 'email', isMandatory: false, validationMessage: 'Please enter a valid email address.', events: [{ type: 'focusout', validationRule: ValidationRules.EmailID }] },
    { name: 'mobile', isMandatory: false,validationMessage: 'Please enter a valid mobile number.', events: [{ type: 'keypress', validationRule: ValidationRules.NumberOnly },{ type: 'focusout', validationRule: ValidationRules.MobileNoWithSeries }] },
    { name: 'password', isMandatory: true, validationMessage: 'Please enter a valid password', events: [] },
  ];

  // get email() { return this.loginForm.get('email'); }
  // get mobile() { return this.loginForm.get('mobile'); }
  // get password() { return this.loginForm.get('password'); }

  constructor() {
    this.loginForm = this.FormUtils.createFormGroup(this.formFields, this.fb);
  }
   toggleEmailMobile(): void {
    
    this.showEmail = !this.showEmail;
    this.emailShowError = false;
    this.toggleFieldValidation();
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  } 
  toggleFieldValidation() {
  const fieldName = this.showEmail ? 'email' : 'mobile';
  const field = this.formFields.find(f => f.name === fieldName);
  const control = this.loginForm.get(fieldName);
  const element = this.inputElements.find(
    (el) => el.nativeElement.getAttribute('formControlName') === fieldName
  )?.nativeElement as HTMLInputElement | undefined;

  if (field && control && element) {
    control.markAsDirty();
    control.markAsTouched();
    control.updateValueAndValidity();
    
    this.FormUtils.updateValidationRule(element, field, true, this.renderer, control);
    control.reset();
  }
  }
  ngAfterViewInit() {
      this.FormUtils.registerFormFieldEventListeners(this.formFields, this.inputElements.toArray(), this.renderer,this.loginForm);
      this.toggleFieldValidation();

      const inputs = document.querySelectorAll('.p-inputtext');
      inputs.forEach((input) => {
        input.addEventListener('focus', () => {
            gsap.to(input, {
                    duration: 0.5,
                    ease: 'power2.inOut', 
                    boxShadow: '0 0 5px #57b846', opacity: 1
                  });
            const symbol = input.parentElement?.querySelector('.symbol-input100 i');
            if (symbol) {
                  gsap.to(symbol, { duration: 0.4, color: '#57b846' });
              }
          });
            input.addEventListener('blur', () => {
              gsap.to(input, { duration: 0.3, boxShadow: 'none', opacity: 1 });
              const symbol = input.parentElement?.querySelector('.symbol-input100 i');
              if (symbol) {
                    gsap.to(symbol, { duration: 0.4, color: '#666666' }); 
             }
        });
        });

    // GSAP for form title entrance animation
    gsap.from('.login100-form-title', { duration: 1, y: 50, opacity: 0, ease: 'power2.out' });

    // GSAP for button hover
    const button = document.querySelector('.login100-form-btn');
    if (button) {
      button.addEventListener('mouseenter', () => {
        gsap.to(button, { duration: 0.4, backgroundColor: '#333333' });
      });
      button.addEventListener('mouseleave', () => {
        gsap.to(button, { duration: 0.4, backgroundColor: '#57b846' });
      });
    }

    // GSAP tilt animation for the image container (replacing js-tilt)
    if (this.tiltContainer) {
      const container = this.tiltContainer.nativeElement;
      const img = container.querySelector('img');

      container.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        gsap.to(img, {
          duration: 0.3,
          rotationX: rotateX,
          rotationY: rotateY,
          transformPerspective: 1000,
          ease: 'power2.out'
        });
      });

      container.addEventListener('mouseleave', () => {
        gsap.to(img, {
          duration: 0.5,
          rotationX: 0,
          rotationY: 0,
          ease: 'power2.out'
        });
      });

      // Initial entrance animation for image
      gsap.from(img, { duration: 1, scale: 0.8, opacity: 0, ease: 'back.out(1.7)' });
    }
  }
  onSubmit() {
  const outcome = this.FormUtils.validateFormFields(this.formFields, this.loginForm, this.inputElements.toArray(), this.renderer);
    if (outcome.isError) {
      this.notificationService.showMessage(outcome.strMessage, outcome.title, outcome.type);
      return;
    }  
  const loginModel = this.FormUtils.getAllFormFieldData(this.formFields, this.loginForm, this.inputElements.toArray(), MUserLogin);
  this.loginService.GetUserLogin(loginModel).subscribe({
      next: (res) => {
        if (res.isError) {
          this.notificationService.showMessage(res.strMessage, res.title, res.type);
        } else {
          this.notificationService.showMessage(res.strMessage, res.title, res.type);
        }
      },
      error: (err) => {
        this.notificationService.showMessage(
          'Something went wrong while connecting to the server.',
          'Error',
          PopupMessageType.Error
        );
      }
    });
  }
}
