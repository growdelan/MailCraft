export type TagCategory = 'Personalizacja' | 'Płatności' | 'Sprawa' | 'Linki' | 'Meta';

export interface TagItem {
  key: string;
  label: string;
  category: TagCategory;
  token: string;
}

const PERSONALIZATION_KEYS = [
  'FirstName',
  'LastName',
  'FullName',
  'Email',
  'Phone',
  'PreferredLanguage',
  'GreetingLine',
  'Signature'
];

const PAYMENT_KEYS = [
  'ContractNumber',
  'InvoiceNumber',
  'AmountDue',
  'AmountPaid',
  'Currency',
  'DueDate',
  'PaymentDate',
  'InstallmentNumber',
  'InstallmentAmount',
  'TotalInstallments',
  'DaysOverdue',
  'InterestAmount',
  'PenaltyAmount',
  'Balance',
  'PaymentLink',
  'BLIKCode',
  'BankAccountNumber',
  'BankName',
  'NextPaymentDate',
  'NextPaymentAmount',
  'DiscountPercent',
  'DiscountDeadline',
  'QRCodePayment'
];

const CASE_KEYS = ['CustomerId', 'CaseId', 'CaseStatus', 'SettlementProposal'];

const LINK_KEYS = ['UnsubscribeLink', 'ViewInBrowserLink', 'PrivacyPolicyLink', 'TermsLink'];

const META_KEYS = [
  'SupportPhone',
  'SupportEmail',
  'AgentName',
  'AgentEmail',
  'AgentPhone',
  'CompanyName',
  'CompanyAddress',
  'City',
  'PostalCode',
  'Country',
  'TodayDate'
];

function mapTags(keys: string[], category: TagCategory): TagItem[] {
  return keys.map((key) => ({
    key,
    label: key,
    category,
    token: `{{${key}}}`
  }));
}

export const TAGS: TagItem[] = [
  ...mapTags(PERSONALIZATION_KEYS, 'Personalizacja'),
  ...mapTags(PAYMENT_KEYS, 'Płatności'),
  ...mapTags(CASE_KEYS, 'Sprawa'),
  ...mapTags(LINK_KEYS, 'Linki'),
  ...mapTags(META_KEYS, 'Meta')
];

export const TAG_CATEGORIES: TagCategory[] = ['Personalizacja', 'Płatności', 'Sprawa', 'Linki', 'Meta'];
