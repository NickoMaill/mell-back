import { StandardError } from '../core/standardError';
import { IEmailContactDetail, InfoContact, MailInstanceTypeEnum, TransactionalEmailType } from '../module/services/mail/contracts';
import { BrevoModule } from '../module/services/mail/mailModule';
import configManager from './configManager';
import * as jwt from 'jsonwebtoken';

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
class CommunicationManager {
    public async addContactToList(email: string, firstName?: string, lastName?: string, itemName?: string, orderId?: string, country?: string, city?: string) {
        const engine = new BrevoModule(MailInstanceTypeEnum.CONTACT);
        const contactInfo: InfoContact = {
            email,
            attributes: {
                NOM: firstName,
                PRENOM: lastName,
                LAST_ITEM: itemName,
                LAST_ORDER_ID: orderId,
                COUNTRY: country,
                CITY: city,
            },
            listIds: [configManager.getConfig.SENDINGBLUE_LIST_ID],
        };
        await engine.createContact(contactInfo);
    }

    public async addSubscriber(email: string, subscriberToken?: string) {
        if (!email) {
            throw new StandardError('CommunicationManager.addSubscriber', 'BAD_REQUEST', 'email_required', 'email is required', `an email is required to subscribe on the mailing list`);
        }

        if (subscriberToken) {
            const decode = jwt.verify(subscriberToken, configManager.getConfig.SUBSCRIBE_SECRET) as { subscribed: boolean; email: string };

            if (decode.email === email) {
                throw new StandardError('CommunicationManager.addSubscriber', 'BAD_REQUEST', 'already_subscribed', 'contact already subscribed', `contact with email ${email} is already subscribed`);
            }
        }

        const contactInfo: InfoContact = {
            email,
            listIds: [configManager.configAsNumber.SENDINGBLUE_LIST_ID],
        };
        const engine = new BrevoModule(MailInstanceTypeEnum.CONTACT);
        const isSubscribed = await engine.getContactByEmail(contactInfo.email);

        if (isSubscribed) {
            throw new StandardError('CommunicationManager.addSubscriber', 'BAD_REQUEST', 'already_subscribed', 'contact already subscribed', `contact with email ${contactInfo.email} is already subscribed on the list id ${configManager.getConfig.SENDINGBLUE_LIST_ID}`);
        }

        await engine.createContact(contactInfo);

        const token = jwt.sign({ subscribed: true, email: contactInfo.email }, configManager.getConfig.SUBSCRIBE_SECRET);
        return token;
    }

    public async sendOrderEmail(to: string, orderId: string, firstName: string, itemName: string) {
        const engine = new BrevoModule(MailInstanceTypeEnum.TRANSACTIONAL);
        const emailInfo: TransactionalEmailType = {
            to: [{ email: to }],
            replyTo: { email: configManager.getConfig.USER_MAIL },
            params: {
                NOM: firstName,
                LAST_ORDER_ID: orderId,
                LAST_ITEM: itemName,
            },
            templateId: 3,
        };
        await engine.sendTransactionalEmail(emailInfo);
    }

    public async sendContactEmail(data: IEmailContactDetail) {
        if (data.from.length < 1 || data.subject.length < 1 || data.textContent.length < 1) {
            throw new StandardError('communicationManager.sendContactEmail', 'BAD_REQUEST', 'missing_data', 'wrong data receive', 'wrong data receive from website');
        }
        if (!data.from.match(emailRegex)) {
            throw new StandardError('communicationManager.sendContactEmail', 'BAD_REQUEST', 'wrong_email_format', 'wrong email format receive', 'email format is invalid');
        }
        const engine = new BrevoModule(MailInstanceTypeEnum.TRANSACTIONAL);
        const emailInfo: TransactionalEmailType = {
            to: [{ email: configManager.getConfig.USER_MAIL }],
            subject: data.subject,
            htmlContent: `<p>${data.textContent}</p><br/><br/><span>cet email vous est envoyé depuis l'email ${data.from}</span>`,
        };

        await engine.sendTransactionalEmail(emailInfo);
    }

    public async sendResetPassword(to: string, token: string) {
        const engine = new BrevoModule(MailInstanceTypeEnum.TRANSACTIONAL);
        const emailInfo: TransactionalEmailType = {
            to: [{ email: to }],
            subject: 'Réinitialisation de votre mot de passe',
            htmlContent: `<p>Bonjour</p><br/><br/>
            <p>Vous avez émis une demande de reinitialisation de mot de passe, <a href='${configManager.getConfig.API_BASE_URL}/admin/password/chooseNewPassword/${token}'>cliquez-ici</a> pour modifier votre mot de passe</p><br/><br/>
            <p>Si le lien ne fonctionne pas essayez celui - ci →  <a href='${configManager.getConfig.API_BASE_URL}/admin/password/chooseNewPassword/${token}'>${configManager.getConfig.API_BASE_URL}/admin/password/chooseNewPassword/${token}</a></p><br/><br/>
            <p>Best regards</p>
            <p><strong>L'équipe d'Untel Officiel</strong></p>
            `,
        };
        await engine.sendTransactionalEmail(emailInfo);
    }

    public async sendMfa(to: string, otp: string) {
        const engine = new BrevoModule(MailInstanceTypeEnum.TRANSACTIONAL);
        const emailInfo: TransactionalEmailType = {
            to: [{ email: to }],
            subject: "Mell Admin : authentification a deux facteurs",
            htmlContent: `
            <p>Bonjour</p>
            <p>Une connexion a été initié sur l'interface administrateur du site mellhumour.com.</p>
            <p>Entrez ce code dans l'espace prévue à cette effet, vous serez redirigé vers votre interface d'administration</p>
            <p style="font-weight: bold; color: red; text-align: center;">Si vous n'êtes pas a l'origine de cette connexion veuillez en informé votre administrateur</p>
            <p style="font-size: 2rem; font-weight: bold; text-align: center; margin-top: 1rem; margin-bottom: 3rem;">${otp}</p>
            <span>Merci,</span><br/>
            <span>L'équipe support mellhumour.com,</span>
            `
        }
        await engine.sendTransactionalEmail(emailInfo);
    }
}

export default new CommunicationManager();