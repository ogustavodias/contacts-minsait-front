import { Component, inject } from '@angular/core';
import { Person } from 'src/app/models/person';
import { PersonService } from 'src/app/services/person.service';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.scss'],
})
export class PersonListComponent {
  personService = inject(PersonService);
  personList: Person[] = [];

  ngOnInit() {
    this.getAllPersons();
  }

  getAllPersons() {
    this.personService.getAllPersons().subscribe({
      next: (response) => {
        this.personList = response.body;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
