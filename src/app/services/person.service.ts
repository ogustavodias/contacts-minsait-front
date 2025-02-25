import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Person } from '../models/person';
import { ApiResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  http = inject(HttpClient);
  API = 'http://localhost:8081/api/persons';

  constructor() {}

  getAllPersons() {
    return this.http.get<ApiResponse<Person[]>>(this.API);
  }

  getPersonById(id: Number) {
    return this.http.get<ApiResponse<Person>>(`${this.API}/${id}`);
  }

  deletePersonById(id: Number) {
    return this.http.delete<ApiResponse<Person>>(`${this.API}/${id}`);
  }
}
