import { Component, OnInit } from '@angular/core';
import { Person } from 'src/app/models/person';
import { FilterService } from 'src/app/services/filter.service';
import { PersonService } from 'src/app/services/person.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.scss'],
})
export class PersonListComponent implements OnInit {
  personList: Person[] = [];
  personListFiltered: Person[] = [];

  constructor(
    private pService: PersonService,
    private fService: FilterService
  ) {}

  ngOnInit() {
    this.getAllPersons();
    this.loadFilter();
  }

  loadFilter() {
    this.fService.filter$.subscribe((search) => this.applyFilter(search));
  }

  applyFilter(search: string) {
    if (!search) this.personListFiltered = this.personList;

    this.personListFiltered = this.personList.filter(
      (p) =>
        `${p.id}`.toLowerCase().includes(search.toLowerCase()) ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.postalCode.toLowerCase().includes(search.toLowerCase()) ||
        p.city.toLowerCase().includes(search.toLowerCase()) ||
        p.state.toLowerCase().includes(search.toLowerCase()) ||
        p.street.toLowerCase().includes(search.toLowerCase()) ||
        `${p.contacts.length}`.toLowerCase().includes(search.toLowerCase())
    );
  }

  getAllPersons() {
    this.pService.getAllPersons().subscribe({
      next: (response) => {
        this.personList = response.body;
        this.personListFiltered = this.personList;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  deletePersonById(id: number) {
    Swal.fire({
      title: 'A Pessoa será deletada, deseja prosseguir?',
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
    }).then((confirmation) => {
      if (!confirmation.isConfirmed) return;

      this.pService.deletePersonById(id).subscribe({
        next: () => {
          Swal.fire({ title: 'Pessoa removida com sucesso', icon: 'success' });
          this.getAllPersons();
        },
        error: () => {
          Swal.fire({
            title: 'Falha na tentativa de deletar a pessoa',
            icon: 'error',
          });
        },
      });
    });
  }
}
