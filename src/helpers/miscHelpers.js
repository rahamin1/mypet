export const sleep = (ms) => {
  const start = new Date().getTime();
  while (new Date().getTime() < start + ms);
};
