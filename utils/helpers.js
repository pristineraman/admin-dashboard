export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US");
};

export const calculatePercentage = (part, total) => {
  if (total === 0) return 0;
  return ((part / total) * 100).toFixed(2);
};

export const generateRandomId = () => {
  return "_" + Math.random().toString(36).substr(2, 9);
};

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};
