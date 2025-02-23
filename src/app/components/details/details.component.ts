import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent {
  inEditing = false;
  route = inject(ActivatedRoute);

  ngOnInit() {
    this.route.paramMap.subscribe((params) =>
      params.get('id') ? (this.inEditing = false) : (this.inEditing = true)
    );
  }

  startEditing() {
    this.inEditing = true;
  }

  finishEditing() {
    this.inEditing = false;
  }
}
