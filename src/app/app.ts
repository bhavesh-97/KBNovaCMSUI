import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { LoaderService } from '../app/services/loader.service';
import { AsyncPipe } from '@angular/common';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,ButtonModule,AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  protected readonly title = signal('KBNovaCMSUI');
  public LoaderService = inject(LoaderService);
  loading$ = this.LoaderService.loading$;
  
  ngOnInit(): void {
    // Call setFavicon on initialization
    this.setFavicon('../assets/images/product/Tothesourceicon.png','64x64');
  }

 setFavicon(iconUrl: string, size: string = '32x32') {
  let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");

  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.getElementsByTagName('head')[0].appendChild(link);
  }

  link.type = 'image/svg';
  link.href = iconUrl;
  link.sizes = size; // e.g., '16x16', '32x32', '64x64'
}
}
