import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,ButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  protected readonly title = signal('KBNovaCMSUI');

  ngOnInit(): void {
    // Call setFavicon on initialization
    this.setFavicon('./assets/images/product/KBNova.png');
  }

  setFavicon(iconUrl: string) {
    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    
    link.type = 'image/x-icon';
    link.href = iconUrl;
  }
}
