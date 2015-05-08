/**
 * Require stripe module instance with platform account's secret API key
 */
var stripe = require("stripe")("sk_test_OBXX3FRuomYskOfEP62qbgMz"); 


/**
 * Takes token created from a debit card (client side) to create a 'customer' object associated with the Stripe platform account.
 * Returns a Stripe customer ID that should be saved to the associated user so it can later be retreived and charged to a different user's Stripe Connect account.
 */
exports.createPlatformCustomer = function(stripeToken, callback) {
  stripe.customers.create({
    source: stripeToken 
  }, function(err, customer) {
    // callback(err, customer)
    if (err) {
      console.log('Error:', err)
    } else {
      console.log('New customer!')
      callback(customer);  
    }
  });
};

/**
 * Subordinate function: see use in chargeCustomerToAccount
 * Takes stripe customer ID of accoung being charged and stripe Connect ID of the charging account
 * Returns a one-time use token for creating the actual charge.
 */
var createTokenFromCustomerId = function(customerId, stripeConnectAccessToken, callback) {
  stripe.tokens.create({ 
    customer: customerId, 
  }, stripeConnectAccessToken, // user's access token from the Stripe Connect flow
    function(err, token) {
      if (err){
        console.log('Error:', err)
      } else {
        console.log('Token created!');
        console.log(token);
        callback(token);
      }
  });
};

/**
 * Takes stripe customer ID of accoung being charged, stripe Connect ID and stripe Connect access token of the charging account and amount being charged (in cents!).
 * Transfers amount param from customer ID account to stripe Connect ID account.
 */
exports.chargeCustomerToAccount = function(customerId, stripeConnectAccountId, stripeConnectAccessToken, amount) {
  
  createTokenFromCustomerId(customerId, stripeConnectAccessToken, function(token) {
    stripe.charges.create({
      amount: amount,
      currency: 'usd',
      source: token
    }, { stripe_account: stripeConnectAccountId }, 
    function(err, charge) {
      if (err) {
        console.log('Error:', err);
      } else {
        console.log('Charged!');
        console.log(charge);
      }
    });
  
  });
};

