'use strict';
// most of this example is from https://github.com/stripe-archive/firebase-mobile-payments/blob/main/functions/index.js#L32
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';


admin.initializeApp();

const stripe = require('stripe')(functions.config().stripe.secret, {
  apiVersion: '2023-08-16',
});


/**
 * When a user is created, create a Stripe customer object for them.
 */
exports.createStripeCustomer = functions.auth.user().onCreate(async (user) => {
  const customer = await stripe.customers.create({
    email: user.email,
    metadata: { firebaseUID: user.uid },
  });

  await admin.firestore().collection('stripe_customers').doc(user.uid).set({
    customer_id: customer.id,
  });
  return;
});

/**
 * Set up an ephemeral key.
 *
 * @see https://stripe.com/docs/mobile/android/basic#set-up-ephemeral-key
 * @see https://stripe.com/docs/mobile/ios/basic#ephemeral-key
 */
exports.createEphemeralKey = functions.https.onCall(async (data, context) => {
  // Checking that the user is authenticated.
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called while authenticated!'
    );
  }
  const uid = context.auth.uid;
  try {
    if (!uid) throw new Error('Not authenticated!');
    // Get stripe customer id
    const customer = (
      await admin.firestore().collection('stripe_customers').doc(uid).get()
    ).data().customer_id;
    const key = await stripe.ephemeralKeys.create(
      { customer },
      { apiVersion: data.api_version }
    );
    return key;
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * When a payment document is written on the client,
 * this function is triggered to create the PaymentIntent in Stripe.
 *
 * @see https://stripe.com/docs/mobile/android/basic#complete-the-payment
 */
exports.createStripePayment = functions.firestore
  .document('stripe_customers/{userId}/payments/{pushId}')
  .onCreate(async (snap, context) => {
    
    const { amount, currency } = snap.data();
    try {
      // Look up the Stripe customer id.
      const customer = (await snap.ref.parent.parent.get()).data().customer_id;
      const ephemeralKey = await stripe.ephemeralKeys.create(
        { customer },
        { apiVersion: '2023-08-16' }
      );
      // Create a charge using the pushId as the idempotency key
      // to protect against double charges.
      const idempotencyKey = context.params.pushId;
      const payment = await stripe.paymentIntents.create(
        {
          amount,
          currency,
          customer,
        },
        { idempotencyKey }
      );
      payment.ephemeralKey = ephemeralKey.secret;
      // If the result is successful, write it back to the database.
      await snap.ref.set(payment);
    } catch (error) {
      // We want to capture errors and render them in a user-friendly way, while
      // still logging an exception with StackDriver
      console.log(error);
      await snap.ref.set({ error: userFacingMessage(error) }, { merge: true });
      // await reportError(error, { user: context.params.userId });
    }
  });

/**
 * Create Stripe Connect account ( marketplace worker )
 */


// copied from Rocket Rides Example
//  where it says if (account_id == "") might not be necessary, handled in front end
exports.createConnectedAccountAndTriggerRefreshUrl = functions.firestore
  .document('stripe_supplier/{userId}')
  .onCreate(async (snap, context) => {
    try {
      const firebaseUID = context.params.userId;
      const stripeID = await admin.firestore()
        .collection('stripe_supplier')
        .doc(firebaseUID)
        .get();
      
      const account_id = stripeID.data().account_id;
      if (account_id == "") {
        const userData = await admin.firestore()
          .collection('users') // Replace with the actual collection path
          .doc(firebaseUID)
          .get();
        const userEmail = userData.data().email;
        const account = await stripe.accounts.create({
          type: 'express',
          country: 'US',
          email: userEmail, // Set the email associated with the account
        });
        await snap.ref.set(account);

         // Store the account information in Firestore
        await admin.firestore()
          .collection('stripe_supplier')
          .doc(firebaseUID)
          .set({
           account_id: account.id,
          }, { merge: true }); // Merge option to update the document
        
 // Create the account link
 
          const accountLinks = await stripe.accountLinks.create({
            type: 'account_onboarding',
            account: account.id, // Use the Stripe account ID directly
            refresh_url: 'https://us-central1-functions-849f0.cloudfunctions.net/refresh_url', // Update with the correct refresh_url
            return_url: 'https://www.colonly.com', // Set the return_url
          });
          await admin.firestore()
          .collection('stripe_supplier')
          .doc(firebaseUID)
          .set({
            account_link: accountLinks.url
          }, { merge: true }); // Merge option to
        
          return;
        }
        } catch (error) {
      console.error('Error creating connected account:', error);
    };
  });

/**
 * Coppied from ROcket Rides Example
 * Refreshes the onboarding link for a connected account.
 */
exports.triggerRefresh = functions.firestore
  .document('stripe_supplier/{userId}')
  .onUpdate(async (snapshot, context) => {
    try {
      const firebaseUID = context.params.userId;
      const userData = await admin.firestore()
        .collection('stripe_supplier')
        .doc(firebaseUID)
        .get();
      
      const account_link = userData.data().account_link;
      if (account_link == "") {
        const userData = await admin.firestore()
          .collection('stripe_supplier') // Replace with the actual collection path
          .doc(firebaseUID)
          .get();
        const stripeID = userData.data().account_id;
       
      
 // Create the ONBOARDING link
          const accountLinks = await stripe.accountLinks.create({
            type: 'account_onboarding',
            account: stripeID, // Use the Stripe account ID directly
            refresh_url: 'https://us-central1-functions-849f0.cloudfunctions.net/refresh_url', // Update with the correct refresh_url
            return_url: 'https://www.colonly.com', // Set the return_url
          });
          await admin.firestore()
          .collection('stripe_supplier')
          .doc(firebaseUID)
          .set({
            account_link: accountLinks.url
          }, { merge: true }); // Merge option to
          return;
        }
        } catch (error) {
      console.error('Error creating connected account:', error);
    };
  });
/**
 * Refreshes the LOGIN link for a connected account.
 * MAKE sure we have charges enabled and details submitted to start function
 * 
 * to get this to work, i had to manually create a login_linking field in the database
 * once created. it will update the login_linking field with the link. so we need to create either a login_linking in the database manually or when a user creates one. in the front end. 
 * it triggers when ONUPDATE. so when the user presses the login button. the front end code turns the URL into "" so then this function triggers because it updates.
 */
exports.loginLinkRefresh = functions.firestore
  .document('stripe_supplier/{userId}')
  .onUpdate(async (snapshot, context) => {
    try {
      const firebaseUID = context.params.userId;
      const userData = await admin.firestore()
        .collection('stripe_supplier')
        .doc(firebaseUID)
        .get();
      
      const login_link = userData.data().login_linking;
      const account_id = userData.data().account_id;
      console.log('CALLED✅ account id:', account_id);
      console.log('CALLED✅ login link:', login_link);
      if (login_link == "") {
        // you dont have to recall user data, you already have. userdata.data. so just 
        // const userData = await admin.firestore()
        //   .collection('stripe_supplier') // Replace with the actual collection path
        //   .doc(firebaseUID)
        //   .get();
        // const stripeID = userData.data().account_id;
       
      
 // Create the ONBOARDING link
          const loginLink = await stripe.accounts.createLoginLink(account_id
         );
          await admin.firestore()
          .collection('stripe_supplier')
          .doc(firebaseUID)
          .set({
            login_linking: loginLink.url
          }, { merge: true }); // Merge option to
          return;
        }
        } catch (error) {
      console.error('Error creating connected account:', error);
    };
  });
  
  // NORMAL WEBHOOK ---------------- VvVvvvvvvvvvvvvvvvv
  /**
   * Helper function to update a payment record in Cloud Firestore.
   */

const updatePaymentRecord = async (id) => {
    try {
      const payment = await stripe.paymentIntents.retrieve(id);
      const customerId = payment.customer;
      console.log('Step 1: Retrieving payment object', customerId, 'and', payment.id);
      const customersSnap = await admin
      .firestore()
      .collection('stripe_customers')
      .where('customer_id', '==', customerId)
      .get();
      console.log('Step 2: Retrieving customer doc in Firestore');
        if (customersSnap.size !== 1) {
            console.error('❌ User not found for payment:', id);
            throw new Error('User not found!');
        }
        const paymentsSnap = await customersSnap.docs[0].ref
        .collection('payments')
        .where('id', '==', payment.id)
        .get();
        console.log('Step 3: Updating record in Firestore', payment.id);
        if (paymentsSnap.size !== 1) {
            console.error('❌ Payment not found:', payment.id);
            throw new Error('Payment not found!');
        }
        await paymentsSnap.docs[0].ref.set(payment);
        console.log('✅ Payment record updated successfully:', payment.id);
    } catch (error) {
        console.error('❌ Error updating payment record:', error);
        throw error;
    }
};


exports.handleWebhookEvents = functions.https.onRequest(async (req, resp) => {
    const relevantEvents = new Set([
        'account.updated',
        'payment_intent.succeeded',
        'payment_intent.processing',
        'payment_intent.payment_failed',
        'payment_intent.canceled',
    ]);
  let event;
  

    try {
        event = stripe.webhooks.constructEvent(
            req.rawBody,
            req.headers['stripe-signature'],
            functions.config().stripe.webhooksecret
        );
    } catch (error) {
        console.error('❗️ Webhook Error: Invalid Secret');
        resp.status(401).send('Webhook Error: Invalid Secret');
        return;
    }
    if (relevantEvents.has(event.type)) {
        try {
            switch (event.type) {
                case 'payment_intent.succeeded':
                case 'payment_intent.processing':
                case 'payment_intent.payment_failed':
                case 'payment_intent.canceled':
                    const id = event.data.object.id;
                    await updatePaymentRecord(id);
                break;
                
                default:
                    throw new Error('Unhandled relevant event!');
            }
            console.log('✅ Event processed:', event.type);
        } catch (error) {
            console.error(`❗️ Webhook error for [${event.data.object.id}]`, error.message);
            resp.status(400).send('Webhook handler failed. View Function logs.');
            return;
        }
    }
    resp.json({ received: true });
    console.log('✅ Success');
});
// NORMAL WEBHOOK ---------------- ^^^^^^^^^^^^^^^^^^
// CONNECT WEBHOOK ---------------- VvVvvvvvvvvvvvvvvvv
const updateAccountUpdate = async (connectAccountId) => {
  try {
   
    
    console.log('Step 1: Retrieving account object')
        // Assuming the 'account' property holds the customer ID
      // using the get or (retrieve)from stripe 

      const accountId = connectAccountId
      const customerId = await stripe.accounts.retrieve(accountId);
      // in the response, we get. account
      
             // customer snap may not be working because of format
//        const customersSnap = await admin
//             .firestore()
//             .collection('stripe_supplier')
//             .doc(firebaseUID)
//             .get(); 
      
      
//      const supplierDocRef = customersSnap.ref;
// await supplierDocRef.update({
//    customerId,
// });
 
    
     // charges enabled & details submitted means connect account created. can add to firebase, but maybe make it trigger something?
        // we work the UI according to whether or not the account is created
        // we can send the account link??
        console.log('✅ Account update record updated successfully details...:', customerId.details_submitted, 'and..charges:', customerId.charges_enabled);
    } catch (error) {
        console.error('❌ Error updating account update record:', error);
        throw error;
    }
};



exports.connectWebhookEvents = functions.https.onRequest(async (req, resp) => {
// const firebaseUID = req.query.userId; 
      //  console.log('✅ UID HERE N:', firebaseUID);
  const endpointSecret = "whsec_MF3XkzhEwQ0sthNXFTvRjHLKjSK7PH6p"
    const relevantEvents = new Set([
        'account.updated', 
    ]);
  let event;
  

    try {
        event = stripe.webhooks.constructEvent(
            req.rawBody,
          req.headers['stripe-signature'],
            endpointSecret,
        
            // functions.config().stripe.webhooksecret
        );
    } catch (error) {
        console.error('❗️ Connect Webhook Error: Invalid Secret');
        resp.status(401).send('Connect Webhook Error: Invalid Secret');
        return;
    }
    if (relevantEvents.has(event.type)) {
        try {
            switch (event.type) {
                 case 'account.updated':
                const connectAccountId = event.data.object.id;
      // Accessing the account ID from the event data
                    await updateAccountUpdate(connectAccountId);
                break;
                default:
                    throw new Error('Unhandled relevant event!');
            }
            console.log('✅ Connect Event processed:', event.type);
        } catch (error) {
            console.error(`❗️Connect Webhook error for [${event.data.object.id}]`, error.message);
            resp.status(400).send('Connnect Webhook handler failed. View Function logs.');
            return;
        }
    }
    resp.json({ received: true });
    console.log('✅ Success from Connect webhook');
});


// CONNECT WEBHOOK ---------------- ^^^^^^^^^^^^^^^^^^

/**
 * When a user deletes their account, clean up after them.
 */

exports.cleanupUser = functions.auth.user().onDelete(async (user) => {
  const dbRef = admin.firestore().collection('stripe_customers');
  const customer = (await dbRef.doc(user.uid).get()).data();
  await stripe.customers.del(customer.customer_id);
  // Delete the customers payments & payment methods in firestore.
  const snapshot = await dbRef
    .doc(user.uid)
    .collection('payment_methods')
    .get();
  snapshot.forEach((snap) => snap.ref.delete());
  await dbRef.doc(user.uid).delete();
  return;
});





/**
 * To keep on top of errors, we should raise a verbose error report with Stackdriver rather
 * than simply relying on console.error. This will calculate users affected + send you email
 * alerts, if you've opted into receiving them.
 */

// [START reporterror]

// function reportError(err, context = {}) {
//   // This is the name of the StackDriver log stream that will receive the log
//   // entry. This name can be any valid log stream name, but must contain "err"
//   // in order for the error to be picked up by StackDriver Error Reporting.
//   // const logName = 'errors';
//   // const log = logging.log(logName);

//   // https://cloud.google.com/logging/docs/api/ref_v2beta1/rest/v2beta1/MonitoredResource
//   const metadata = {
//     resource: {
//       type: 'cloud_function',
//       labels: { function_name: process.env.FUNCTION_NAME },
//     },
//   };

//   // https://cloud.google.com/error-reporting/reference/rest/v1beta1/ErrorEvent
//   const errorEvent = {
//     message: err.stack,
//     serviceContext: {
//       service: process.env.FUNCTION_NAME,
//       resourceType: 'cloud_function',
//     },
//     context: context,
//   };

//   // Write the error log entry
//   return new Promise((resolve, reject) => {
//     log.write(log.entry(metadata, errorEvent), (error) => {
//       if (error) {
//         return reject(error);
//       }
//       return resolve();
//     });
//   });
// }

// [END reporterror]

/**
 * Sanitize the error message for the user.
 */
function userFacingMessage(error) {
  return error.type
    ? error.message
    : 'An error occurred, developers have been alerted';
}

