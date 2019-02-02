# Imazip

Imazip is JavaScript module that compresses images for the front end.
Imazip can quickly create a thumbnail image.
It is very simple!

## Installation

```
npm install imazip
```

## How to use

### When using a FileReader

```html
<input type="file"
       onchange="return onChange(event)">
```

```js
import imazip from 'imazip'
// const imazip = require('imazip')

function onChange(e) {
  const files = e.target.files || e.dataTransfer.files
  const reader = new FileReader()
  
  if (files && files.length > 0) {
    reader.readAsDataURL(files[0])
    reader.onload = () => {
      imazip({
        height: 500,
        src: reader.result,
        format: files[0].type,
        quality: .7,
        thumbnail: {
          maxSize: 200,
          quality: .5
        }
      })
        .then(image => {
          console.log(
            image.origin,  // data:image/jpeg;base64,/9j/4AAQSkZJRgABA...
            image.thumbnail  // data:image/jpeg;base64,/9j/4AAQSkZJRgABA...
          )
        })
    }
  }
}
```

### When using the axios

```js
import imazip from 'imazip'
import axios from 'axios'

function getImage() {
  const url = 'https://avatars3.githubusercontent.com/u/16679082?s=460&v=4'
  axios
    .get(url, {
      responseType: 'arraybuffer'
    })
    .then(response => {
      const type = response.headers['content-type'].toLowerCase()
      const image = btoa(
        new Uint8Array(response.data)
          .reduce((data, byte) => data + String.fromCharCode(byte), ''))

      return {
        src: `data:${type};base64,${image}`,
        type
      }
    })
    .then(image => {
      return imazip({
        src: image.src,
        format: image.type,
        quality: .7,
        thumbnail: {
          maxSize: 200,
          quality: .5
        }
      })
    })
    .then(image => {
      console.log(
        image.origin,  // data:image/jpeg;base64,/9j/4AAQSkZJRgABA...
        image.thumbnail  // data:image/jpeg;base64,/9j/4AAQSkZJRgABA...
      )
    })
}
```

## Options

### width

- Type: `Number`,
- Default: `null`

The width value of the image to be output.
Because The aspect ratio is automatically adjusted, It is recommended to enter only one value either `width` or `height`.
If neither `width` nor `height` is entered, the original size is output.

### height

- Type: `Number`,
- Default: `null`

The height value of the image to be output.
Because The aspect ratio is automatically adjusted, It is recommended to enter only one value either `width` or `height`.
If neither `width` nor `height` is entered, the original size is output.

### src

- Type: `String`,
- Default: `""`,
- Required!

HTML image format supported by `<img>` element.
[Information about what image formats the browsers support.](https://en.wikipedia.org/wiki/Comparison_of_web_browsers#Image_format_support)

### quality

- Type: `Number`,
- Default: `0.8`

A Number between 0 and 1 indicating the image quality to use for image formats that use lossy compression such as `image/jpeg` and `image/webp`.

### format

- Type: `String`,
- Default: `image/jpeg`

The mime type of the output image such as `image/png` and `image/jpeg`.
The following 3 formats are supported.

Value | Alias
--|--
`image/jpeg` | `jpg`
`image/png` | `png`
`image/webp` | `webp`

### maxSize

- Type: `Number`,
- Default: `1920`

Specifies the largest(max) size of the image to be output.
It is based on a larger value, regardless of the horizontal and vertical size of the image.
For example, if the value of `maxSize` is` 1200`, to ouput  '1200x720'px image from '2500x1500'px image Or to output `720x1200`px image from `1500x2500`px image.

### thumbnail

- Type: `Object`,
- Default: `null`

Imazip can process a single image while simultaneously creating a thumbnail image of that image.
This is useful for distinguishing between image to be saved and image to be displayed.
The options for the thumbnail image have the same meaning as above.

### thumbnail.width

- Type: `Number`,
- Default: `null`

### thumbnail.height

- Type: `Number`,
- Default: `null`

### thumbnail.maxSize

- Type: `Number`,
- Default: `200`

### thumbnail.quality

- Type: `Number`,
- Default: `0.8`