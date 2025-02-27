import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Contact, ContactType } from 'src/app/models/contact';

@Component({
  selector: 'app-contact-modal',
  templateUrl: './contact-modal.component.html',
  styleUrls: ['./contact-modal.component.scss'],
})
export class ContactModalComponent {
  @Input() contactList: Contact[] = [];
  @Output() updateList = new EventEmitter<Contact[]>();
  inEditing: Contact | null = null;

  isOpen = false;

  contactTypeOptions: ContactType[] = ['EMAIL', 'PHONE'];

  contactForm = new FormGroup({
    id: new FormControl(0),
    contactType: new FormControl(''),
    contactValue: new FormControl(''),
  });

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
    const updatedList = this.contactList.map(contact => contact.id === updatedContact.id ? updatedContact : contact);
    this.updateList.emit(updatedList);
  }

  addContact() {
    const lastItemId = this.contactList[this.contactList.length - 1]?.id || 0;
    const contact: Contact = {
      ...this.contactForm.value,
      id: lastItemId + 1,
    } as Contact;
    this.contactList.push(contact);
    this.updateList.emit(this.contactList);
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
