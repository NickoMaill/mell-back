import { GetExtendedContactDetails } from '@getbrevo/brevo';
import http from 'http';
export type TransactionalEmailType = {
    to: ToType[];
    replyTo?: ToType;
    subject?: string;
    templateId?: number;
    params?: ContactAttribute;
    htmlContent?: string;
};

type ToType = {
    email: string;
};

export type InfoContact = {
    email: string;
    listIds: number[];
    attributes?: ContactAttribute;
};

type ContactAttribute = {
    NOM?: string;
    PRENOM?: string;
    LAST_ITEM?: string;
    LAST_ORDER_ID?: string;
    COUNTRY?: string;
    CITY?: string;
};

export interface IEmailContactDetail {
    subject?: string;
    textContent?: string;
    from: string;
    to?: string;
}

export enum MailInstanceTypeEnum {
    CONTACT = 0,
    SENDERS = 1,
    TRANSACTIONAL = 2,
}

export type GetContactResponse = {
    response: http.IncomingMessage;
    body: GetExtendedContactDetails;
};