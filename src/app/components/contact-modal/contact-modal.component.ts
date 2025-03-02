import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Contact,
  ContactRegex,
  ContactType,
  contactTypeOptions,
} from 'src/app/models/contact';

@Component({
  selector: 'app-contact-modal',
  templateUrl: './contact-modal.component.html',
  styleUrls: ['./contact-modal.component.scss'],
})
export class ContactModalComponent implements OnInit {
  @Input() contactList: Contact[] = [];
  @Output() updateList = new EventEmitter<Contact[]>();

  inEditing: Contact | null = null;
  isOpen = false;
  contactTypeOptions = contactTypeOptions;
  contactForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.onChangeContactType();
  }

  initForm() {
    this.contactForm = this.fb.group({
      id: [0],
      contactType: ['', [Validators.required]],
      contactValue: ['', [Validators.required, Validators.pattern('')]],
    });
  }

  onChangeContactType() {
    const contactTypeField = this.contactForm.get('contactType');

    if (!contactTypeField) return;

    contactTypeField.valueChanges.subscribe(
      (contactType: keyof ContactType) => {
        const contactValueField = this.contactForm.get('contactValue');

        if (!contactValueField || !contactTypeField.value) return;

        contactValueField.setValidators([
          Validators.required,
          Validators.pattern(ContactRegex[contactType].regex),
        ]);

        contactValueField.updateValueAndValidity();
      }
    );
  }

  setInEditing(contact: Contact) {
    this.inEditing = contact;
    this.fillFieldsWithEditingContact();
  }

  fillFieldsWithEditingContact() {
    if (!this.inEditing) return;

    this.contactForm.patchValue({
      id: this.inEditing.id,
      contactType: this.inEditing.contactType,
      contactValue: this.inEditing.contactValue,
    });
  }

  saveEdit() {
    const updatedContact = this.contactForm.value as Contact;
    const updatedList = this.contactList.map((contact) =>
      contact.id === updatedContact.id ? updatedContact : contact
    );
    this.updateList.emit(updatedList);
    this.closeModal();
  }

  addContact() {
    const lastItemId = this.contactList[this.contactList.length - 1]?.id || 0;
    const contact: Contact = {
      ...this.contactForm.value,
      id: lastItemId + 1,
    } as Contact;
    this.contactList.push(contact);
    this.updateList.emit(this.contactList);
    this.closeModal();
  }

  showErrorMessage(fieldName: string) {
    const field = this.contactForm.get(fieldName);

    if (!field) return false;
    return field.invalid && field.touched;
  }

  getInputErrorMessage(fieldName: keyof Contact) {
    const field = this.contactForm.get(fieldName);

    if (!field) return;

    if (field.hasError('required')) {
      return 'Campo obrigatório';
    }

    if (field.hasError('pattern')) {
      switch (fieldName) {
        case 'contactValue':
          return 'Contato inválido, insira um contato compatível com o tipo informado';
      }
    }

    return 'Campo inválido';
  }

  openModal() {
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
    this.inEditing = null;
    this.contactForm.reset();
  }

  checkOutsideClick(e: MouseEvent) {
    if (e.target === e.currentTarget) this.closeModal();
  }
}
