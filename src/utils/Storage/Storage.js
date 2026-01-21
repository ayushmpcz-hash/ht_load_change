const APP_KEY = "HT_LOAD_CHANGE_APP_AUTH";

export const saveAppAuth = (payload) => {
  localStorage.setItem(APP_KEY, JSON.stringify(payload));
};

export const getAppAuth = () => {
  const data = localStorage.getItem(APP_KEY);
  return data ? JSON.parse(data) : null;
};

export const clearAppAuth = () => {
  localStorage.removeItem(APP_KEY);
};
