function sizeFilter(optWidth, optHeight, imgWidth, imgHeight) {
  let w,
    h;

  // Only width as an option.
  if (optWidth && !optHeight) {
    w = optWidth;
    h = optWidth * imgHeight / imgWidth;
  }
  // Only height as an option.
  else if (!optWidth && optHeight) {
    w = optHeight * imgWidth / imgHeight;
    h = optHeight;
  }
  // The width and height as an options.
  else if (optWidth && optHeight) {
    w = optWidth;
    h = optHeight;
  }
  // When two size options are unknown.
  else {
    w = imgWidth;
    h = imgHeight;
  }

  return {
    width: w,
    height: h
  }
}

function resizeImage(w, h, m) {
  const wide = {
    size: w > h ? w : h,
    name: w > h ? 'width' : 'height'
  };
  const narrow = {
    size: w > h ? h : w,
    name: w > h ? 'height' : 'width'
  };

  if (wide.size < m) {
    return {
      width: w,
      height: h
    };
  }

  return {
    [wide.name]: m,
    [narrow.name]: m * narrow.size / wide.size
  };
}

function checkMimeType(format) {
  const mimeTypes = [
    { alias: 'png', value: 'image/png' },
    { alias: 'jpg', value: 'image/jpeg' },
    { alias: 'webp', value: 'image/webp' }
  ];

  for (let i = 0; i < mimeTypes.length; i++) {
    if (mimeTypes[i].alias === format || mimeTypes[i].value === format) {
      return mimeTypes[i].value
    }
    return 'image/jpeg'
  }
}

export default {
  sizeFilter,
  resizeImage,
  checkMimeType
};