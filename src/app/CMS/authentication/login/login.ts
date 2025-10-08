import { Component, AfterViewInit, inject, ElementRef,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { gsap } from 'gsap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, InputTextModule, ButtonModule,TooltipModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements AfterViewInit {
  @ViewChild('tiltContainer', { static: false }) tiltContainer!: ElementRef<HTMLDivElement>;
  private fb = inject(FormBuilder);
  loginForm: FormGroup;
  emailShowError = false;
  passwordShowError = false;
  showPassword = false; 
  showEmail = true;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.pattern(/^\+?\d{10,15}$/)]], // Mobile optional unless selected
      password: ['', Validators.required]
    });
  }
toggleEmailMobile(): void {
  this.showEmail = !this.showEmail;
  this.emailShowError = false;
  this.loginForm.get('email')?.reset();
  this.loginForm.get('mobile')?.reset();
}
 togglePasswordVisibility(): void {
  console.log('Icon clicked');
  this.showPassword = !this.showPassword;
}
  ngAfterViewInit() {
    // GSAP animation for input focus (adapting the CSS shadow animation)
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
        const rotateX = (y - centerY) / 10; // Adjust sensitivity
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

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
  get mobile() { return this.loginForm.get('mobile'); }
}
