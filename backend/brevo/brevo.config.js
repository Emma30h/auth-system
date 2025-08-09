// backend/brevo/brevo.config.js
import SibApiV3Sdk from '@sendinblue/client';
import { config } from 'dotenv';
config();

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

export default apiInstance;

export const sender = {
  email: 'emma30h@gmail.com',
  name: 'Heredia Dev',
};


