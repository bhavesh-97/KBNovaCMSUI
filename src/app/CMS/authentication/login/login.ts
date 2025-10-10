import { Component, AfterViewInit, inject, ElementRef,ViewChild, QueryList, ViewChildren,Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { gsap } from 'gsap';
import { SharedImports } from '../../shared/imports/shared-imports.ts';
import { FormFieldConfig, FormUtils } from '../../shared/utilities/form-utils.ts.js';
import { ValidationRules } from '../../shared/utilities/validation-rules.enum.js';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../../services/notification.service.js';

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
  private toastr = inject(ToastrService);
  private FormUtils = inject(FormUtils);
  loginForm: FormGroup;
  emailShowError = false;
  passwordShowError = false;
  showPassword = false; 
  showEmail = false;


  // Form field configurations
  private formFields: FormFieldConfig[] = [
    { name: 'email', isMandatory: true, validationMessage: 'Please enter a valid email address.', events: [{ type: 'focusout', validationRule: ValidationRules.EmailID }] },
    { name: 'mobile', isMandatory: false,validationMessage: 'Please enter a valid mobile number.', events: [{ type: 'focusout', validationRule: ValidationRules.NumberOnly },{ type: 'keypress', validationRule: ValidationRules.NumberOnly }] },
    { name: 'password', isMandatory: true, validationMessage: 'Password must be strong and meet all requirements.', events: [{ type: 'focusout', validationRule: ValidationRules.PasswordStrength }] },
    // { name: 'password', isMandatory: true, events: [{ type: 'focusout', validationRule: ValidationRules.PasswordStrength }, { type: 'keypress', validationRule: ValidationRules.PasswordStrength }] },
  ];

  constructor() {
    // this.loginForm = this.fb.group({
    //   email: ['', [Validators.required, Validators.email]],
    //   mobile: ['', [Validators.pattern(/^\+?\d{10,15}$/)]], 
    //   password: ['', Validators.required]
    // });
    this.loginForm = this.FormUtils.createFormGroup(this.formFields, this.fb);
  }
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
  get mobile() { return this.loginForm.get('mobile'); }

  // toggleEmailMobile(): void {
  //   this.showEmail = !this.showEmail;
  //   this.emailShowError = false;
  //   this.loginForm.get('email')?.reset();
  //   this.loginForm.get('mobile')?.reset();
  // }
   toggleEmailMobile(): void {
    debugger;
    this.showEmail = !this.showEmail;
    this.emailShowError = false;
    this.toggleFieldValidation();
  }
  togglePasswordVisibility(): void {
    console.log('Icon clicked');
    this.showPassword = !this.showPassword;
  } 
  toggleFieldValidation() {
    const fieldName = this.showEmail ? 'email' : 'mobile';
    const field = this.formFields.find(f => f.name === fieldName);
    const element = this.inputElements.first?.nativeElement as HTMLInputElement;
    const control = this.loginForm.get(fieldName);
    if (field && control && element) {
      this.FormUtils.updateValidationRule(element, field, true, this.renderer, control);
      control.reset();
    }
  }
  private initFieldListeners(): void {
  this.FormUtils.registerFormFieldEventListeners(
    this.formFields,
    this.inputElements.toArray(),
    this.renderer,
    this.loginForm
  );
  this.toggleFieldValidation();
}
  ngAfterViewInit() {
      // this.FormUtils.registerFormFieldEventListeners(this.formFields, this.inputElements.toArray(), this.renderer,this.loginForm);
      // this.toggleFieldValidation();
        // Run once when the view first initializes
  this.initFieldListeners();

  // Re-run when the inputs change (e.g. showEmail toggles)
  this.inputElements.changes.subscribe(() => {
    this.initFieldListeners();
  });
    // Debug: Log inputElements
    console.log('inputElements:', this.inputElements.toArray().map(el => ({
      formControlName: el.nativeElement.getAttribute('formControlName')
    })));
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
                    gsap.to(symbol, { duration: 0.4, color: '#666666' }); // Revert to normal color
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
  this.toastr.success('This is a success toast!', 'Success')
  if (this.loginForm.valid && (this.showEmail ? this.email?.valid : this.mobile?.valid)) {
    console.log('Login submitted', this.showEmail ? { email: this.email?.value, password: this.password?.value } : { mobile: this.mobile?.value, password: this.password?.value });
  } else {
    this.emailShowError = this.showEmail ? this.email?.invalid || false : this.mobile?.invalid || false;
    this.passwordShowError = this.password?.invalid || false;
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }
}
}
