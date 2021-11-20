const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");

var util = require("util");
var EventEmitter = require("events");

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": "618e655fae7991001351ea26",
      "PLAID-SECRET": "b5c17f83ca1bedbbd9521ed07b20db",
    },
  },
});

//console.log(configuration);

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || "sandbox";

// PLAID_PRODUCTS is a comma-separated list of products to use when initializing
// Link. Note that this list must contain 'assets' in order for the app to be
// able to create and retrieve asset reports.
const PLAID_PRODUCTS = (process.env.PLAID_PRODUCTS || "transactions").split(
  ","
);

// PLAID_COUNTRY_CODES is a comma-separated list of countries for which users
// will be able to select institutions from.
const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || "US").split(
  ","
);

//console.log(PLAID_COUNTRY_CODES);

// Parameters used for the OAuth redirect Link flow.
//
// Set PLAID_REDIRECT_URI to 'http://localhost:3000'
// The OAuth redirect flow requires an endpoint on the developer's website
// that the bank website should redirect to. You will need to configure
// this redirect URI for your client ID through the Plaid developer dashboard
// at https://dashboard.plaid.com/team/api.
const PLAID_REDIRECT_URI = process.env.PLAID_REDIRECT_URI || "";

// Parameter used for OAuth in Android. This should be the package name of your app,
// e.g. com.plaid.linksample
const PLAID_ANDROID_PACKAGE_NAME = process.env.PLAID_ANDROID_PACKAGE_NAME || "";

// We store the access_token in memory - in production, store it in a secure
// persistent data store
let ACCESS_TOKEN = null;
let PUBLIC_TOKEN = null;
let ITEM_ID = null;
// The payment_id is only relevant for the UK Payment Initiation product.
// We store the payment_id in memory - in production, store it in a secure
// persistent data store
let PAYMENT_ID = null;
// The transfer_id is only relevant for Transfer ACH product.
// We store the transfer_id in memomory - in produciton, store it in a secure
// persistent data store
let TRANSFER_ID = null;

const client = new PlaidApi(configuration);

module.exports = {
  createplaidtoken: async (req, res) => {
    // Get the client_user_id by searching for the current user
    //const user = await User.find(...);

    //console.log("Here");
    const clientUserId = req.session.user;
    const request = {
      user: {
        // This should correspond to a unique id for the current user.
        client_user_id: clientUserId,
      },
      client_name: "Budgety",
      products: PLAID_PRODUCTS,
      country_codes: PLAID_COUNTRY_CODES,
      language: "en",
      webhook: "https://webhook.example.com",
    };
    try {
      const createTokenResponse = await client.linkTokenCreate(request);
      res.json(createTokenResponse.data);

      console.log(createTokenResponse.data);
    } catch (error) {
      // handle error

      //prettyPrintResponse(error.response);
      console.log("This is the error:" + error.res);
      return res.json(formatError(error.res));
    }
  },

  // Create a link token with configs which we can then use to initialize Plaid Link client-side.
  // See https://plaid.com/docs/#payment-initiation-create-link-token-request
  requestplaidtoken: async function (req, res, next) {
    try {
      const createRecipientResponse =
        await client.paymentInitiationRecipientCreate({
          name: "Harry Potter",
          iban: "GB33BUKB20201555555555",
          address: {
            street: ["4 Privet Drive"],
            city: "Little Whinging",
            postal_code: "11111",
            country: "GB",
          },
        });
      const recipientId = createRecipientResponse.data.recipient_id;
      prettyPrintResponse(createRecipientResponse);

      const createPaymentResponse = await client.paymentInitiationPaymentCreate(
        {
          recipient_id: recipientId,
          reference: "paymentRef",
          amount: {
            value: 12.34,
            currency: "GBP",
          },
        }
      );
      prettyPrintResponse(createPaymentResponse);
      const paymentId = createPaymentResponse.data.payment_id;
      PAYMENT_ID = paymentId;
      const configs = {
        user: {
          // This should correspond to a unique id for the current user.
          client_user_id: req.session.user,
        },
        client_name: "Plaid Quickstart",
        products: PLAID_PRODUCTS,
        country_codes: PLAID_COUNTRY_CODES,
        language: "en",
        payment_initiation: {
          payment_id: paymentId,
        },
      };
      if (PLAID_REDIRECT_URI !== "") {
        configs.redirect_uri = PLAID_REDIRECT_URI;
      }
      const createTokenResponse = await client.linkTokenCreate(configs);
      prettyPrintResponse(createTokenResponse);
      res.json(createTokenResponse.data);

      console.log(`This is the link token object ${createTokenResponse.data}`);
    } catch (error) {
      prettyPrintResponse(error.res);
      return res.json(formatError(error.res));
    }
  },

  // Exchange token flow - exchange a Link public_token for
  // an API access_token
  // https://plaid.com/docs/#exchange-token-flow

  setplaidtoken: async function (req, res, next) {

    PUBLIC_TOKEN = req.body.publicToken;
    try {
      const tokenResponse = await client.itemPublicTokenExchange({
        public_token: PUBLIC_TOKEN,
      });
      prettyPrintResponse(tokenResponse);
      ACCESS_TOKEN = tokenResponse.data.access_token;
      ITEM_ID = tokenResponse.data.item_id;
      if (PLAID_PRODUCTS.includes("transfer")) {
        TRANSFER_ID = await authorizeAndCreateTransfer(ACCESS_TOKEN);
      }
      res.json({
        access_token: ACCESS_TOKEN,
        item_id: ITEM_ID,
        error: null,
      });
    } catch (error) {
      prettyPrintResponse(error.res);
      return res.json(formatError(error.res));
    }
  },

  // Retrieve ACH or ETF Auth data for an Item's accounts
  // https://plaid.com/docs/#auth
  getplaiditems: async function (req, res, next) {
    try {
      const authResponse = await client.authGet({ access_token: ACCESS_TOKEN });
      prettyPrintResponse(authResponse);
      res.json(authResponse.data);
    } catch (error) {
      prettyPrintResponse(error.res);
      return res.json(formatError(error.res));
    }
  },

  // Retrieve Transactions for an Item
  // https://plaid.com/docs/#transactions
  setplaidtransactionsitems: async function (req, res, next) {
    // Pull transactions for the Item for the last 30 days
    const startDate = moment().subtract(30, "days").format("YYYY-MM-DD");
    const endDate = moment().format("YYYY-MM-DD");
    const configs = {
      access_token: ACCESS_TOKEN,
      start_date: startDate,
      end_date: endDate,
      options: {
        count: 250,
        offset: 0,
      },
    };
    try {
      const transactionsResponse = await client.transactionsGet(configs);
      prettyPrintResponse(transactionsResponse);
      res.json(transactionsResponse.data);
    } catch (error) {
      prettyPrintResponse(error.res);
      return res.json(formatError(error.res));
    }
  },

  // Retrieve Investment Transactions for an Item
  // https://plaid.com/docs/#investments

  getplaidinvestemnenttransactions: async function (req, res, next) {
    const startDate = moment().subtract(30, "days").format("YYYY-MM-DD");
    const endDate = moment().format("YYYY-MM-DD");
    const configs = {
      access_token: ACCESS_TOKEN,
      start_date: startDate,
      end_date: endDate,
    };
    try {
      const investmentTransactionsResponse =
        await client.investmentTransactionsGet(configs);
      prettyPrintResponse(investmentTransactionsResponse);
      res.json({
        error: null,
        investment_transactions: investmentTransactionsResponse.data,
      });
    } catch (error) {
      prettyPrintResponse(error.res);
      return res.json(formatError(error.res));
    }
  },

  // Retrieve Identity for an Item
  // https://plaid.com/docs/#identity
  retrieveidentity: async function (req, res, next) {
    try {
      const identityResponse = await client.identityGet({
        access_token: ACCESS_TOKEN,
      });
      prettyPrintResponse(identityResponse);
      res.json({ identity: identityResponse.data.accounts });
    } catch (error) {
      prettyPrintResponse(error.res);
      return res.json(formatError(error.res));
    }
  },

  // Retrieve real-time Balances for each of an Item's accounts
  // https://plaid.com/docs/#balance
  retrievebalances: async function (req, res, next) {
    try {
      const balanceResponse = await client.accountsBalanceGet({
        access_token: ACCESS_TOKEN,
      });
      prettyPrintResponse(balanceResponse);
      res.json(balanceResponse.data);
    } catch (error) {
      prettyPrintResponse(error.res);
      return res.json(formatError(error.res));
    }
  },

  // Retrieve Holdings for an Item
  // https://plaid.com/docs/#investments

  retrieveholdings: async function (request, response, next) {
    try {
      const holdingsResponse = await client.investmentsHoldingsGet({
        access_token: ACCESS_TOKEN,
      });
      prettyPrintResponse(holdingsResponse);
      response.json({ error: null, holdings: holdingsResponse.data });
    } catch (error) {
      prettyPrintResponse(error.response);
      return response.json(formatError(error.response));
    }
  },

  // Retrieve information about an Item
  // https://plaid.com/docs/#retrieve-item

  retrieveitem: async function (req, res, next) {
    try {
      // Pull the Item - this includes information about available products,
      // billed products, webhook information, and more.
      const itemResponse = await client.itemGet({ access_token: ACCESS_TOKEN });
      // Also pull information about the institution
      const configs = {
        institution_id: itemResponse.data.item.institution_id,
        country_codes: ["US"],
      };
      const instResponse = await client.institutionsGetById(configs);
      prettyPrintResponse(itemResponse);
      res.json({
        item: itemResponse.data.item,
        institution: instResponse.data.institution,
      });
    } catch (error) {
      prettyPrintResponse(error.res);
      return res.json(formatError(error.res));
    }
  },

  // Retrieve an Item's accounts
  // https://plaid.com/docs/#accounts

  retrieveitemaccounts: async function (req, res, next) {
    try {
      const accountsResponse = await client.accountsGet({
        access_token: ACCESS_TOKEN,
      });
      prettyPrintResponse(accountsResponse);
      res.json(accountsResponse.data);
    } catch (error) {
      prettyPrintResponse(error.res);
      return res.json(formatError(error.res));
    }
  },

  // Create and then retrieve an Asset Report for one or more Items. Note that an
  // Asset Report can contain up to 100 items, but for simplicity we're only
  // including one Item here.
  // https://plaid.com/docs/#assets

  retrieveitemsasset: async function (req, res, next) {
    // You can specify up to two years of transaction history for an Asset
    // Report.
    const daysRequested = 10;

    // The `options` object allows you to specify a webhook for Asset Report
    // generation, as well as information that you want included in the Asset
    // Report. All fields are optional.
    const options = {
      client_report_id: "Custom Report ID #123",
      // webhook: 'https://your-domain.tld/plaid-webhook',
      user: {
        client_user_id: "Custom User ID #456",
        first_name: "Alice",
        middle_name: "Bobcat",
        last_name: "Cranberry",
        ssn: "123-45-6789",
        phone_number: "555-123-4567",
        email: "alice@example.com",
      },
    };
    const configs = {
      access_tokens: [ACCESS_TOKEN],
      days_requested: daysRequested,
      options,
    };
    try {
      const assetReportCreateResponse = await client.assetReportCreate(configs);
      prettyPrintResponse(assetReportCreateResponse);
      const assetReportToken =
        assetReportCreateResponse.data.asset_report_token;
      const getResponse = await getAssetReportWithRetries(
        client,
        assetReportToken
      );
      const pdfRequest = {
        asset_report_token: assetReportToken,
      };

      const pdfResponse = await client.assetReportPdfGet(pdfRequest, {
        responseType: "arraybuffer",
      });
      prettyPrintResponse(getResponse);
      prettyPrintResponse(pdfResponse);
      response.json({
        json: getResponse.data.report,
        pdf: pdfResponse.data.toString("base64"),
      });
    } catch {
      prettyPrintResponse(error.res);
      return res.json(formatError(error.res));
    }
  },

  transfer: async function (req, res, next) {
    try {
      const transferGetResponse = await client.transferGet({
        transfer_id: TRANSFER_ID,
      });
      prettyPrintResponse(transferGetResponse);
      res.json({ error: null, transfer: transferGetResponse.data.transfer });
    } catch (error) {
      prettyPrintResponse(error.res);
      return res.json(formatError(error.res));
    }
  },
  // This functionality is only relevant for the UK Payment Initiation product.
  // Retrieve Payment for a specified Payment ID

  payment: async function (req, res, next) {
    try {
      const paymentGetResponse = await client.paymentInitiationPaymentGet({
        payment_id: PAYMENT_ID,
      });
      prettyPrintResponse(paymentGetResponse);
      res.json({ error: null, payment: paymentGetResponse.data });
    } catch (error) {
      prettyPrintResponse(error.response);
      return res.json(formatError(error.res));
    }
  },
};

// const server = app.listen(APP_PORT, function () {
//   console.log('plaid-quickstart server listening on port ' + APP_PORT);
// });

const prettyPrintResponse = (res) => {
  console.log(util.inspect(res.data, { colors: true, depth: 4 }));
};

// This is a helper function to poll for the completion of an Asset Report and
// then send it in the response to the client. Alternatively, you can provide a
// webhook in the `options` object in your `/asset_report/create` request to be
// notified when the Asset Report is finished being generated.

const getAssetReportWithRetries = (
  plaidClient,
  asset_report_token,
  ms = 1000,
  retriesLeft = 20
) =>
  new Promise((resolve, reject) => {
    const request = {
      asset_report_token,
    };

    plaidClient
      .assetReportGet(request)
      .then((response) => {
        return resolve(response);
      })
      .catch(() => {
        setTimeout(() => {
          if (retriesLeft === 1) {
            return reject("Ran out of retries while polling for asset report");
          }
          getAssetReportWithRetries(
            plaidClient,
            asset_report_token,
            ms,
            retriesLeft - 1
          ).then((response) => resolve(response));
        }, ms);
      });
  });

const formatError = (error) => {
  return {
    error: { ...error.data, status_code: error.status },
  };
};

// This is a helper function to authorize and create a Transfer after successful
// exchange of a public_token for an access_token. The TRANSFER_ID is then used
// to obtain the data about that particular Transfer.

const authorizeAndCreateTransfer = async (accessToken) => {
  try {
    // We call /accounts/get to obtain first account_id - in production,
    // account_id's should be persisted in a data store and retrieved
    // from there.
    const accountsResponse = await client.accountsGet({
      access_token: accessToken,
    });
    const accountId = accountsResponse.data.accounts[0].account_id;

    const transferAuthorizationResponse =
      await client.transferAuthorizationCreate({
        access_token: accessToken,
        account_id: accountId,
        type: "credit",
        network: "ach",
        amount: "12.34",
        ach_class: "ppd",
        user: {
          legal_name: "FirstName LastName",
          email_address: "foobar@email.com",
          address: {
            street: "123 Main St.",
            city: "San Francisco",
            region: "CA",
            postal_code: "94053",
            country: "US",
          },
        },
      });
    prettyPrintResponse(transferAuthorizationResponse);
    const authorizationId = transferAuthorizationResponse.data.authorization.id;

    const transferResponse = await client.transferCreate({
      idempotency_key: "1223abc456xyz7890001",
      access_token: accessToken,
      account_id: accountId,
      authorization_id: authorizationId,
      type: "credit",
      network: "ach",
      amount: "12.34",
      description: "Payment",
      ach_class: "ppd",
      user: {
        legal_name: "FirstName LastName",
        email_address: "foobar@email.com",
        address: {
          street: "123 Main St.",
          city: "San Francisco",
          region: "CA",
          postal_code: "94053",
          country: "US",
        },
      },
    });
    prettyPrintResponse(transferResponse);
    return transferResponse.data.transfer.id;
  } catch (error) {
    prettyPrintResponse(error.response);
  }
};
