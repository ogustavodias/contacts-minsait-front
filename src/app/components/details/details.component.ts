import { Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Person, states } from 'src/app/models/person';
import { PersonService } from 'src/app/services/person.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent {
  route = inject(ActivatedRoute);
  personService = inject(PersonService);

  brStates = states;

  form = new FormGroup({
    name: new FormControl({ value: '', disabled: true }),
    postalcode: new FormControl({ value: '', disabled: true }),
    state: new FormControl({ value: '', disabled: true }),
    city: new FormControl({ value: '', disabled: true }),
    street: new FormControl({ value: '', disabled: true }),
  });

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
      else this.startEditing();
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
      complete: () => {
        this.fillFieldsWithPersonInfo();
      },
    });
  }

  fillFieldsWithPersonInfo() {
    this.form.patchValue({
      name: this.person.name,
      postalcode: this.person.postalCode,
      state: this.person.state,
      city: this.person.city,
      street: this.person.street,
    });
  }

  startEditing() {
    this.form.enable();
  }

  finishEditing() {
    this.form.disable();
  }
}
