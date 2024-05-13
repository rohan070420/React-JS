export const oktaConfig = {
  clientId: "0oagwccw8sJxpXKhn5d7",
  issuer: "https://dev-14016989.okta.com/oauth2/default",
  redirectUri: `https://localhost:3000/login/callback`,
  scopes: ["openid", "profile", "email"],
  pkce: true,
  disableHttpsCheck: true,
};
