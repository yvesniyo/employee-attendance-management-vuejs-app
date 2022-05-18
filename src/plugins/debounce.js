export function debounce(fn, delay) {
  var timeoutId = null;

  return function() {
    clearTimeout(timeoutId);

    let args = arguments;
    let that = this;

    timeoutId = setTimeout(function() {
      fn.apply(that, args);
    }, delay);
  };
}
