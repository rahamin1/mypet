// return true if still logged in with facebook, false otherwise
export const checkFacebookLogin = (token, expires) => {
  const curTime = new Date().getTime() / 1000;
  return (token && expires > curTime);
};
