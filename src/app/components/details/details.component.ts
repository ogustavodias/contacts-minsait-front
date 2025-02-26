import { Component, inject, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Person, states } from 'src/app/models/person';
import { PersonService } from 'src/app/services/person.service';
import { ContactModalComponent } from '../contact-modal/contact-modal.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent {
  @ViewChild(ContactModalComponent) modal!: ContactModalComponent;
  route = inject(ActivatedRoute);
  router = inject(Router);
  idInRoute = this.route.snapshot.paramMap.get('id') || 0;
  personService = inject(PersonService);

  brStates = states;

  person: Person = {
    id: 0,
    name: '',
    postalCode: '',
    state: '',
    city: '',
    street: '',
    contacts: [],
  };

  personForm = new FormGroup({
    id: new FormControl({ value: this.idInRoute, disabled: true }),
    name: new FormControl({ value: '', disabled: true }),
    postalCode: new FormControl({ value: '', disabled: true }),
    state: new FormControl({ value: '', disabled: true }),
    city: new FormControl({ value: '', disabled: true }),
    street: new FormControl({ value: '', disabled: true }),
    contacts: new FormControl({ value: this.person.contacts, disabled: true }),
  });

  ngOnInit() {
    if (this.idInRoute) this.getPersonById(Number(this.idInRoute));
    else this.startEditing();
  }

  onSubmit() {
    this.person = { ...this.personForm.value } as Person;
    console.log(this.idInRoute, this.person);

    if (this.idInRoute) this.updatePersonById(this.person.id, this.person);
    else this.insertPerson(this.person);
  }

  insertPerson(person: Person) {
    this.personService.insertPerson(person).subscribe({
      next: (response) => {
        console.log(response);
        this.router.navigateByUrl('/');
      },
      error: (error) => {
        console.log(error);
      },
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

  updatePersonById(id: number, personUpdated: Person) {
    this.personService.updatePersonById(id, personUpdated).subscribe({
      next: (response) => {
        console.log(response);
        this.router.navigateByUrl('/');
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  fillFieldsWithPersonInfo() {
    this.personForm.patchValue({
      name: this.person.name,
      postalCode: this.person.postalCode,
      state: this.person.state,
      city: this.person.city,
      street: this.person.street,
      contacts: this.person.contacts,
    });
  }

  deleteContact(id: number) {
    this.person.contacts = this.person.contacts.filter((c) => c.id !== id);
  }

  startEditing() {
    this.personForm.enable();
  }

  finishEditing() {
    const originalListContacts = this.personForm.value.contacts;
    if (originalListContacts) this.person.contacts = originalListContacts;
    this.personForm.disable();
  }
}
