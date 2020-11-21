require("dotenv").config();
const AWS = require("aws-sdk");

const we_invoke_confirmUserSignup = async (username, name, email) => {
  const handler = require("../../functions/confirm-user-signup").handler;

  const context = {};
  const event = {
    "version": "1",
    "region": process.env.AWS_REGION,
    "userPoolId": process.env.COGNITO_USER_POOL_ID,
    "userName": username,
    "triggerSource": "PostConfirmation_ConfirmSignUp",
    "request": {
      "userAttributes": {
        "sub": username,
        "cognito:email_alias": email,
        "cognito:user_status": "CONFIRMED",
        "email_verified": "false",
        "name": name,
        "email": email
      }
    },
    "response": {}
  }

  await handler(event, context);
};

const a_user_signs_up = async (password, name, email) => {
  const cognito = new AWS.CognitoIdentityServiceProvider()

  const userPoolId = process.env.COGNITO_USER_POOL_ID;
  const clientId = process.env.WEB_COGNITO_USER_POOL_CLIENT_ID;

  const signUpRes = await cognito.signUp({
    ClientId: clientId,
    Username: email,
    Password: password,
    UserAttributes: [
      { Name: "name", Value: name },
    ]
  }).promise();

  const username = signUpRes.UserSub;
  console.log(`[${email}] - user has signed up as [${username}]`);

  // This allows us to skip the verification code
  await cognito.adminConfirmSignUp({
    UserPoolId: userPoolId,
    Username: username,
  }).promise();

  console.log(`[${email}] - confirmed sign up`);

  return {
    username,
    email,
    name,
  }
}

module.exports = {
  we_invoke_confirmUserSignup,
  a_user_signs_up,
}