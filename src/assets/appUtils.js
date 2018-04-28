/* UITLITY FUNCTION */
export const thousandSeparator = function (x, separator = '.') {
  return x
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, separator)
    .replace(/\.0*/g, '.');
}
