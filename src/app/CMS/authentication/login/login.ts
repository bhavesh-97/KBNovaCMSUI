import { Component, AfterViewInit, inject, ElementRef,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { gsap } from 'gsap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, InputTextModule, ButtonModule,],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements AfterViewInit {
  @ViewChild('tiltContainer', { static: false }) tiltContainer!: ElementRef<HTMLDivElement>;
  private fb = inject(FormBuilder);
  loginForm: FormGroup;
  emailShowError = false;
  passwordShowError = false;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngAfterViewInit() {
    // GSAP animation for input focus (adapting the CSS shadow animation)
    const inputs = document.querySelectorAll('.p-inputtext');
    inputs.forEach((input) => {
      input.addEventListener('focus', () => {
        gsap.to(input, {
          duration: 0.5,
          // boxShadow: '0px 0px 70px 25px rgba(222, 224, 221, 0.8)',
          // opacity: 0,
          ease: 'power2.inOut'
        });
        
        // Animate symbol color change if icons are present
        const symbol = input.parentElement?.querySelector('.symbol-input100 i');
        if (symbol) {
          gsap.to(symbol, { duration: 0.4, color: '#57b846' });
        }
      });
      input.addEventListener('blur', () => {
        gsap.to(input, { duration: 0.3, boxShadow: 'none', opacity: 1 });
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
    if (this.loginForm.valid) {
      // Handle login logic here
      console.log('Login submitted', this.loginForm.value);
    } else {
      // Set error flags for invalid fields
      this.emailShowError = this.email?.invalid || false;
      this.passwordShowError = this.password?.invalid || false;
      // Trigger validation errors
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}
