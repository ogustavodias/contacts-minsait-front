import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Person, statesOptions } from 'src/app/models/person';
import { PersonService } from 'src/app/services/person.service';
import { ContactModalComponent } from '../contact-modal/contact-modal.component';
import { Contact } from 'src/app/models/contact';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  @ViewChild(ContactModalComponent) modal!: ContactModalComponent;
  personForm: FormGroup = new FormGroup({});
  contactInEditing: Contact | null = null;

  statesOptions = statesOptions;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private pService: PersonService
  ) {}

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
    this.initForm();
    this.checkIfEditOrRegister();
  }

  getIdInRoute() {
    return this.route.snapshot.paramMap.get('id')
      ? this.route.snapshot.paramMap.get('id')
      : 0;
  }

  initForm() {
    this.personForm = this.fb.group({
      id: [{ value: this.getIdInRoute(), disabled: true }],
      name: [
        { value: '', disabled: true },
        [
          Validators.required,
          Validators.pattern(
            /^[A-Za-zÁÉÍÓÚÀÈÌÒÙÇáéíóúàèìòùç]+(?: [A-Za-zÁÉÍÓÚÀÈÌÒÙÇáéíóúàèìòùç]+)+$/
          ),
        ],
      ],
      postalCode: [
        { value: '', disabled: true },
        [Validators.required, Validators.pattern(/^\d{8}$/)],
      ],
      state: [{ value: '', disabled: true }, [Validators.required]],
      city: [{ value: '', disabled: true }, [Validators.required]],
      street: [{ value: '', disabled: true }, [Validators.required]],
      contacts: [{ value: this.person.contacts, disabled: true }],
    });
  }

  checkIfEditOrRegister() {
    if (this.getIdInRoute()) this.getPersonById(Number(this.getIdInRoute()));
    else this.startEditing();
  }

  onSubmit(e: SubmitEvent) {
    e.preventDefault();

    if (this.getIdInRoute()) this.updatePersonById();
    else this.insertPerson();
  }

  insertPerson() {
    const person: Person = this.personForm.value;

    this.pService.insertPerson(person).subscribe({
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
        contacts: this.person.contacts,
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

  fillFieldsWithPersonInfo() {
    this.personForm.patchValue({
      id: this.person.id,
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

  editContact(contact: Contact) {
    this.modal.setInEditing(contact);
    this.modal.openModal();
  }

  startEditing() {
    this.personForm.enable();
  }

  finishEditing() {
    const originalListContacts = this.personForm.value.contacts;
    if (originalListContacts) this.person.contacts = originalListContacts;
    this.personForm.disable();
  }

  updateContactList(updatedList: Contact[]) {
    this.person.contacts = updatedList;
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
