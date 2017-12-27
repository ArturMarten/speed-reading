export function writeText(context, text) {
  let start = 0;
  text.split('').forEach((letter) => {
    context.fillText(letter, start, 0);
    start += context.measureText(letter).width;
  });
  // console.log(context.measureText(' '));
}
