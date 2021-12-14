// Email address matcher.
const matcher = /^[\w.!#$%&'*+/=?^`{|}~-]+@[a-zA-Z\d](?:[a-zA-Z\d-]{0,61}[a-zA-Z\d])?(?:\.[a-zA-Z\d](?:[a-zA-Z\d-]{0,61}[a-zA-Z\d])?)*$/;

export function isEmail(string: unknown) {
  if (typeof string !== 'string') {
    return false;
  }

  return matcher.test(string);
}
