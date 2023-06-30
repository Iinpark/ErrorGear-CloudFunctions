import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
require('dotenv').config();
const { setGlobalOptions } = require('firebase-functions/v2');

const serviceAccount = require(`../${process.env.SERVICE_ACCOUNT_PATH}`);

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL,
});
const db = admin.database(app);

setGlobalOptions({ region: 'europe-west1' });
export const getDTCCode = onRequest((request, response) => {
  const DTCCode = request.query.code;
  console.log('DTCCode', DTCCode);

  return db
    .ref(`${DTCCode}`)
    .get()
    .then((snapshot) => {
      if (snapshot.exists()) {
        response.send(snapshot.toJSON());
      } else {
        response.send('No data available');
      }
    });
});

