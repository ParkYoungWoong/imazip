import utils from './utils';
import filters from './filters';
import es6Promise from 'es6-promise';
import {
  defaults,
  defaultsForThumb
} from './defaults';

es6Promise.polyfill();

class Imazip {
  constructor(options) {
    this.opts = Object.assign({}, defaults, options);
    this.optsForThumb = Object.assign({}, defaultsForThumb, options.thumbnail);

    this.img = document.createElement('img');
    this.img.src = options.src;

    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.resolve = null;
    this.reject = null;
  }

  _imageListeners() {
    this.img.addEventListener('load', event => {
      this._operator(event);
    });
    this.img.addEventListener('error', event => {
      this._operator(event, true);
    });
  }

  _ctxFilters() {
    const name = this.opts.filter.name;
    const options = this.opts.filter.options
      ? this.opts.filter.options
      : [];
    const imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

    // https://github.com/arahaya/ImageFilters.js
    // ex) filters.GaussianBlur(imageData, strength);
    const filtered = filters[name](imgData, ...options);

    this.ctx.putImageData(filtered, 0, 0);
  }

  _compressor(options) {
    const {
      width,
      height,
      quality,
      maxSize
    } = options;
    const filteredSize = utils.sizeFilter(width, height, this.img.naturalWidth, this.img.naturalHeight);
    const adjustedSize = utils.resizeImage(filteredSize.width, filteredSize.height, maxSize);

    this.canvas.width = adjustedSize.width;
    this.canvas.height = adjustedSize.height;

    this.ctx
      .drawImage(this.img, 0, 0, adjustedSize.width, adjustedSize.height);
    if (this.opts.filter) {
      this._ctxFilters();
    }

    return this.canvas.toDataURL(utils.checkMimeType(this.opts.format), quality);
  }

  _operator(event, isError) {
    if (isError) {
      this.reject(event);
    }

    const origin = this._compressor(this.opts);
    const thumbnail = this.opts.thumbnail
      ? this._compressor(this.optsForThumb)
      : null;

    this.resolve({
      origin,
      thumbnail
    });
  }

  run() {
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
      this._imageListeners();
    });
  }
}

export default Imazip;