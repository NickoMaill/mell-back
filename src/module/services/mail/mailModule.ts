// LIBRARY IMPORT
import { ContactsApi, CreateContact, UpdateContact, TransactionalEmailsApi, SendSmtpEmail, SendersApi, AccountApiApiKeys, GetSendersList, GetSmtpTemplates, ErrorModel, GetExtendedContactDetails } from '@getbrevo/brevo';
import { GetContacts } from '@getbrevo/brevo';
import configManager from '~/managers/configManager';
import { GetContactResponse, InfoContact, MailInstanceTypeEnum, TransactionalEmailType } from './contracts';
import http from 'http';
import { StandardError } from '~/core/standardError';
// MANAGERS IMPORT

export class BrevoModule {
    // INSTANCE
    private readonly contactInstance: ContactsApi;
    private readonly transactionalInstance: TransactionalEmailsApi;
    private readonly sendersInstance: SendersApi;
    // PAYLOAD
    private readonly createContactPayload: CreateContact;
    private readonly updateContactPayload: UpdateContact;
    private readonly sendSmtpPayload: SendSmtpEmail;

    constructor(instance: MailInstanceTypeEnum) {
        this.contactInstance = new ContactsApi();
        this.sendersInstance = new SendersApi();
        this.updateContactPayload = new UpdateContact();
        this.transactionalInstance = new TransactionalEmailsApi();
        this.createContactPayload = new CreateContact();
        this.sendSmtpPayload = new SendSmtpEmail();

        switch (instance) {
            case MailInstanceTypeEnum.CONTACT:
                this.initConfig(this.contactInstance);
                break;
            case MailInstanceTypeEnum.SENDERS:
                this.initConfig(this.sendersInstance);
                break;
            case MailInstanceTypeEnum.TRANSACTIONAL:
                this.initConfig(this.transactionalInstance);
                break;
            default:
                throw new StandardError('sendingBlueModule.constructor', 'FATAL', 'unknown_instance', 'provider instance not found', `Instance for type ${instance} not found`);
        }
    }

    private async initConfig(config: any) {
        await config.setApiKey(AccountApiApiKeys.apiKey, configManager.getConfig.BREVO_APIKEY);
    }

    public async getAllLists() {
        const response = await this.contactInstance.getLists();
        return response;
    }

    public async getContactList(id: number): Promise<GetContacts> {
        const listInfo = await this.contactInstance.getContactsFromList(id);
        return listInfo.body;
    }

    public async getSendersList(): Promise<{ response: http.IncomingMessage; body: GetSendersList }> {
        const response = await this.sendersInstance.getSenders();
        return response;
    }

    public async getEmailTemplateList(): Promise<GetSmtpTemplates> {
        const response = await this.transactionalInstance.getSmtpTemplates();
        return response.body;
    }

    public async createContact(info: InfoContact): Promise<void> {
        this.createContactPayload.email = info.email;
        this.createContactPayload.listIds = info.listIds;
        this.createContactPayload.attributes = info.attributes;
        this.createContactPayload.updateEnabled = true;

        await this.contactInstance.createContact(this.createContactPayload).catch((err) => {
            console.error(err);
        });
    }

    public async updateUser(email: string, info: InfoContact): Promise<void> {
        const emailEncoded = encodeURIComponent(email);

        this.updateContactPayload.listIds = info.listIds;
        this.updateContactPayload.attributes = info.attributes;

        await this.contactInstance.updateContact(emailEncoded, this.updateContactPayload);
    }

    public async sendTransactionalEmail(emailInfo: TransactionalEmailType): Promise<void> {
        this.sendSmtpPayload.sender = { id: configManager.configAsNumber.BREVO_SENDER };
        this.sendSmtpPayload.to = emailInfo.to;
        emailInfo.templateId ? (this.sendSmtpPayload.templateId = emailInfo.templateId) : null;
        emailInfo.subject ? (this.sendSmtpPayload.subject = emailInfo.subject) : null;
        emailInfo.params ? (this.sendSmtpPayload.params = emailInfo.params) : null;
        emailInfo.htmlContent ? (this.sendSmtpPayload.htmlContent = emailInfo.htmlContent) : null;
        this.sendSmtpPayload.replyTo = emailInfo.replyTo ? emailInfo.replyTo : { email: configManager.getConfig.BREVO_USER_MAIL };

        await this.transactionalInstance.sendTransacEmail(this.sendSmtpPayload).catch((err: ErrorModel) => {
            throw new StandardError('communicationManager.SendContactEmail', 'BAD_REQUEST', 'not_send', 'email not send', `email not send from email ${emailInfo.to}`, true, { err });
        });
    }

    public async getContactByEmail(email: string): Promise<GetExtendedContactDetails> {
        const response = await this.contactInstance.getContactInfo(email).catch((err: ErrorModel) => {
            if (err.code === ErrorModel.CodeEnum.DocumentNotFound) {
                return null;
            }
        });

        if (!response) {
            return null;
        } else {
            return (response as GetContactResponse).body;
        }
    }
}