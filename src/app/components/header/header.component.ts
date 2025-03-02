import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { FilterService } from 'src/app/services/filter.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  inHome = false;

  constructor(private fService: FilterService, private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd)
        e.urlAfterRedirects === '/home'
          ? (this.inHome = true)
          : (this.inHome = false);
    });
  }

  filter(e: Event) {
    const search = (e.target as HTMLInputElement).value;
    this.fService.setFilter(search || '');
  }
}
