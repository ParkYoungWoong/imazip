const defaults = {
  width: null,  // Number
  height: null,  // Number
  src: '',  // String
  quality: .8,  // Number
  format: 'image/png',  // String
  maxSize: 1920,  // Number
  thumbnail: null,
  // thumbnail: {
  //   width: null,
  //   height: null,
  //   maxSize: 200,
  //   quality: .8
  // }
};
const defaultsForThumb = Object.assign({}, defaults, {
  maxSize: 200
});

export {
  defaults,
  defaultsForThumb
}