import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators as Val } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Person, statesOptions } from 'src/app/models/person';
import { PersonService } from 'src/app/services/person.service';
import { ContactModalComponent } from '../contact-modal/contact-modal.component';
import { Contact } from 'src/app/models/contact';
import Swal from 'sweetalert2';
import { ViacepService } from 'src/app/services/viacep.service';
import { ViaCepResponse } from 'src/app/models/via-cep-response';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  @ViewChild(ContactModalComponent) modal!: ContactModalComponent;
  personForm: FormGroup = new FormGroup({});
  contactInEditing: Contact | null = null;
  contactsInitial: Contact[] = [];
  contacts: Contact[] = [...this.contactsInitial];

  statesOptions = statesOptions;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private pService: PersonService,
    private viacepService: ViacepService
  ) {}

  ngOnInit() {
    this.initForm();
    this.checkIfEditOrRegister();
  }

  getIdInRoute() {
    return this.route.snapshot.paramMap.get('id')
      ? this.route.snapshot.paramMap.get('id')
      : 0;
  }

  initForm() {
    const nameRegex =
      /^[A-Za-zÁÉÍÓÚÀÈÌÒÙÇáéíóúàèìòùç]+( [A-Za-zÁÉÍÓÚÀÈÌÒÙÇáéíóúàèìòùç]+)+$/;
    const postalCodeRegex = /^\d{8}$/;

    this.personForm = this.fb.group({
      name: ['', [Val.required, Val.pattern(nameRegex)]],
      postalCode: ['', [Val.required, Val.pattern(postalCodeRegex)]],
      state: ['', [Val.required]],
      city: ['', [Val.required]],
      street: ['', [Val.required]],
    });
  }

  checkIfEditOrRegister() {
    if (this.getIdInRoute()) {
      this.personForm.disable();
      this.getPersonById(Number(this.getIdInRoute()));
    } else this.startEditing();
  }

  onSubmit(e: SubmitEvent) {
    e.preventDefault();

    if (this.getIdInRoute()) this.updatePersonById();
    else this.insertPerson();
  }

  insertPerson() {
    const toInsertPerson: Person = {
      ...this.personForm.value,
      id: this.getIdInRoute(),
      contacts: this.contacts,
    };

    this.pService.insertPerson(toInsertPerson).subscribe({
      next: () => {
        Swal.fire({ title: 'Pessoa cadastrada com sucesso', icon: 'success' });
        this.router.navigateByUrl('/');
      },
      error: () => {
        Swal.fire({ title: 'Falha na tentativa de cadastrar', icon: 'error' });
      },
    });
  }

  getPersonById(id: number) {
    this.pService.getPersonById(id).subscribe({
      next: (response) => {
        this.fillFieldsWithPersonInfo(response.body);
      },
      error: () => {
        Swal.fire({
          title: `Pessoa de ID ${this.getIdInRoute()} não encontrada`,
          icon: 'error',
        });
        this.router.navigateByUrl('/details');
      },
    });
  }

  updatePersonById() {
    Swal.fire({
      title: 'Deseja seguir com a edição?',
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
    }).then((confirmation) => {
      if (!confirmation.isConfirmed) return;

      const updatedPerson: Person = {
        ...this.personForm.value,
        id: this.getIdInRoute(),
        contacts: this.contacts,
      };

      this.pService
        .updatePersonById(updatedPerson.id, updatedPerson)
        .subscribe({
          next: () => {
            Swal.fire({ title: 'Pessoa editada com sucesso', icon: 'success' });
            this.router.navigateByUrl('/');
          },
          error: () => {
            Swal.fire({ title: 'Falha na tentativa de edição' });
          },
        });
    });
  }

  fillFieldsWithPersonInfo(person: Person) {
    this.personForm.patchValue({
      name: person.name,
      postalCode: person.postalCode,
      state: person.state,
      city: person.city,
      street: person.street,
    });
    this.contacts = person.contacts;
    this.contactsInitial = [...this.contacts];
  }

  consultPostalCode() {
    const postalCodeField = this.personForm.get('postalCode');

    if (postalCodeField && postalCodeField.valid) {
      this.viacepService.getPostalCodeInfo(postalCodeField.value).subscribe({
        next: (response) => {
          this.fillFieldsWithViaCepResponse(response);
        },
      });
    }
  }

  fillFieldsWithViaCepResponse(info: ViaCepResponse) {
    this.personForm.patchValue({
      state: info.uf,
      city: info.localidade,
      street: info.logradouro,
    });
  }

  deleteContact(id: number) {
    this.contacts = this.contacts.filter((c: Contact) => c.id !== id);
  }

  editContact(contact: Contact) {
    this.modal.setInEditing(contact);
    this.modal.openModal();
  }

  startEditing() {
    this.personForm.enable();
  }

  finishEditing() {
    this.contacts = [...this.contactsInitial];
    this.personForm.disable();
  }

  updateContactList(updatedList: Contact[]) {
    this.contacts = updatedList;
  }

  showErrorMessage(fieldName: keyof Person) {
    const field = this.personForm.get(fieldName);

    if (!field) return false;
    return field.invalid && field.touched;
  }

  getInputErrorMessage(fieldName: keyof Person) {
    const field = this.personForm.get(fieldName);

    if (!field) return;

    if (field.hasError('required')) {
      return 'Campo obrigatório';
    }

    if (field.hasError('pattern')) {
      switch (fieldName) {
        case 'name':
          return 'Deve ser um nome completo válido';
        case 'postalCode':
          return 'Deve ser um CEP válido (somente números e com 8 dígitos)';
      }
    }

    return 'Campo inválido';
  }
}
