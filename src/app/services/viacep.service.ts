import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ViaCepResponse } from '../models/via-cep-response';

@Injectable({
  providedIn: 'root',
})
export class ViacepService {
  API = 'https://viacep.com.br/ws/';
  FORMAT = 'json';

  constructor(private http: HttpClient) {}

  getPostalCodeInfo(postalCode: string) {
    return this.http.get<ViaCepResponse>(
      `${this.API}/${postalCode}/${this.FORMAT}`
    );
  }
}
