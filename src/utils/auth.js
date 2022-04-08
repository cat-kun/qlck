const TokenKey = 'Authorization';

export function getToken() {
  let token = localStorage.getItem(TokenKey) || '';
  if (token === '(null)') token = '';
  return token;
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token);
}
