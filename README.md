# headcount
Friendfunding for trips, events, presents and more.

# PUBLIC USE OF THIS APP HAS BEEN DEPRECATED #
For security reasons, the Venmo developer account used to authorize this application has been deactivated and the database tables have been dropped. Setting up the application with your own developer account should be fairly painless. Good luck!

# Venmo Oauth
Using the Venmo authentication requires a couple different steps (see https://developer.venmo.com/docs/oauth). First, anyone with a regular Venmo account needs to access his/her development tab and create a Venmo application, where the required client ID and client secret keys can be found. These must be used in routes/index.js (line ~250) to redirect the user to the correct Venmo endpoint for authorizing the user's Venmo account on Headcount. In the same spot (line ~263), the app must set the url the user will be redirected to after authorizing his or her account. This also requires the base url for the application (currently http://www.theheadcount.com/) to be entered in the Venmo development panel to allow for successful redirects.


