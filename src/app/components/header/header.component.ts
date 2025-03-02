import { Component } from '@angular/core';
import { FilterService } from 'src/app/services/filter.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private fService: FilterService) {}

  filter(e: Event) {
    const search = (e.target as HTMLInputElement).value;
    this.fService.setFilter(search || '');
  }
}
