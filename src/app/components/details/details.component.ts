import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Person, states } from 'src/app/models/person';
import { PersonService } from 'src/app/services/person.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent {
  inEditing = false;
  route = inject(ActivatedRoute);
  brStates = states;
  personService = inject(PersonService);
  person: Person = {
    id: 0,
    name: '',
    postalCode: '',
    state: '',
    city: '',
    street: '',
    contacts: [],
  };

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) this.getPersonById(Number(id));
      else this.inEditing = true;
    });
  }

  getPersonById(id: number) {
    this.personService.getPersonById(id).subscribe({
      next: (response) => {
        this.person = response.body;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  fillFieldsWithPersonInfo() {}

  startEditing() {
    this.inEditing = true;
  }

  finishEditing() {
    this.inEditing = false;
  }
}
