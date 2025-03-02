import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Person } from '../models/person';
import { ApiResponse } from '../models/api-response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  http = inject(HttpClient);
  API = environment.SERVER + '/api/persons';

  constructor() {}

  insertPerson(person: Person) {
    return this.http.post<ApiResponse<Person>>(this.API, person);
  }

  updatePersonById(id: number, personUpdated: Person) {
    return this.http.patch<ApiResponse<Person>>(
      `${this.API}/${id}`,
      personUpdated
    );
  }

  getAllPersons() {
    return this.http.get<ApiResponse<Person[]>>(this.API);
  }

  getPersonById(id: number) {
    return this.http.get<ApiResponse<Person>>(`${this.API}/${id}`);
  }

  deletePersonById(id: number) {
    return this.http.delete<ApiResponse<Person>>(`${this.API}/${id}`);
  }
}
