type ContactType = 'PHONE' | 'EMAIL';

export interface Contact {
  id: number;
  contactType: ContactType;
  contactValue: string;
}
