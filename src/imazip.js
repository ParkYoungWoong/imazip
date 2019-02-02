import utils from './utils';
require('es6-promise').polyfill();


const _defaults = {
  width: null,  // Number
  height: null,  // Number
  src: '',  // String
  quality: .9,  // Number
  format: 'image/png',  // String
  maxSize: 1920,  // Number
  thumbnail: null,
  // thumbnail: {
  //   width: null,
  //   height: null,
  //   maxSize: 200,
  //   quality: .9
  // }
};
let _opts,
  _img;

function _imageListener(resolve, reject) {
  _img.addEventListener('load', event => {
    _compressImage(resolve, reject);
  });
  _img.addEventListener('error', event => {
    _compressImage(resolve, reject, event, true);
  });
}

function _checkMimeType() {
  let mimeType;

  if (/image\//.test(_opts.format)) {
    mimeType = _opts.format;
  } else {
    switch (_opts.format) {
      case 'png':
        mimeType = 'image/png';
        break;
      case 'webp':
        mimeType = 'image/webp';
        break;
      default:
        // jpg, jpeg, etc..
        mimeType = 'image/jpeg';
    }
  }

  return mimeType;
}

function _makeCopyImage(args) {
  console.log(args);
  const {
    width,
    height,
    quality,
    maxSize
  } = args;
  const canvas = document.createElement('canvas');
  const filteredSize = utils.sizeFilter(width, height, _img.naturalWidth, _img.naturalHeight);
  const adjustedSize = utils.resizeImage(filteredSize.width, filteredSize.height, maxSize);
  canvas.width = adjustedSize.width;
  canvas.height = adjustedSize.height;
  canvas
    .getContext("2d")
    .drawImage(_img, 0, 0, adjustedSize.width, adjustedSize.height);

  return canvas.toDataURL(_checkMimeType(), quality);
}

function _compressImage(resolve, reject, event, isError) {
  if (isError) {
    reject(event);
  }

  const origin = _makeCopyImage(_opts);
  const thumbnail = _opts.thumbnail
    ? _makeCopyImage(_opts.thumbnail)
    : null;

  resolve({
    origin,
    thumbnail
  });
}

function imazip(options) {
  _opts = Object.assign({}, _defaults, options);
  _img = document.createElement('img');
  _img.src = options.src;

  console.log(_img);

  return new Promise((resolve, reject) => {
    _imageListener(resolve, reject);
  });
}

export { imazip, imazip as default };