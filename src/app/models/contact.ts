export interface ContactType {
  PHONE: {
    regex: string;
  };
  EMAIL: {
    regex: string;
  };
}

export const ContactRegex: ContactType = {
  EMAIL: { regex: '^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$' },
  PHONE: { regex: '^\\+?\\d{0,2}\\s?\\(?\\d{2,3}\\)?\\s?\\d{4,5}-?\\d{4}$' },
};

export const contactTypeOptions: (keyof ContactType)[] = ['EMAIL', 'PHONE'];

export interface Contact {
  id: number;
  contactType: ContactType;
  contactValue: string;
}
