import imazip from '../dist/imazip.min'
import axios from 'axios'

new Vue({
  el: '#app',
  data () {
    return {
      origin: '',
      thumbnail: ''
    }
  },
  methods: {
    inputOnchange (e) {
      const files = e.target.files || e.dataTransfer.files
      console.log('vue', e)
      console.log(files)
      console.log(files instanceof File)
      console.log(files instanceof FileList)
      const reader = new FileReader()
      if (files && files.length > 0) {
        reader.readAsDataURL(files[0])
        reader.onload = async () => {
          console.log(reader)
          console.log(files[0].type)
          console.log(reader instanceof FileReader)
          // imazip({
          //   height: 150,
          //   src: reader.result,
          //   format: files[0].type,
          //   thumbnail: {
          //     maxSize: 200,
          //     quality: .7
          //   }
          // })
          //   .then(image => {
          //     console.log(image)
          //     this.origin = image.origin
          //     this.thumbnail = image.thumbnail
          //   })
          const image = await imazip({
            src: reader.result,
            format: files[0].type,
            thumbnail: {
              maxSize: 200,
              quality: .7
            }
          })
          console.log('async/await')
          this.origin = image.origin
          this.thumbnail = image.thumbnail
        }
      }
    },
    async fetchImage () {
      const url = 'https://api.zillinks.com/parse/files/O2ZRIIpko4IomNdwzmoVhYVVEiBBHi2kzUF3Y4vR/48d043f409389e49ca804f4de32691c6_company-logo.jpg'
      // const url = 'heropy_logo.png'

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
            quality: .9,
            thumbnail: {
              maxSize: 200
            }
          })
        })
        .then(image => {
          console.log(image)
          this.origin = image.origin
          this.thumbnail = image.thumbnail
        })
    }
  }
})