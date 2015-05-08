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

