import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  router = inject(Router);
  title = 'person-contact-app';
  currentUrl = '';

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.currentUrl = this.router.url;
    });
  }
}
