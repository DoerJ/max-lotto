
export const debounce = (fn, delay) => {
  var timeout;

  return (...args) => {
    var later = () => {
      fn(...args);
    }
    clearTimeout(timeout);
    timeout = setTimeout(later, delay);
  }
}