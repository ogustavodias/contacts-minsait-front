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

  deletePersonById(id: number) {
    this.personService.deletePersonById(id).subscribe({
      next: (response) => {
        alert(`Pessoa de ID ${response.body.id} removida`);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        // Débito técnico: Refatorar o backend, que está retornando erro quando a lista está vazia, o que faz com que o getAllPersons não execute.
        this.getAllPersons();
      },
    });
  }
}
