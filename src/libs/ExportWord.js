import saveAs from 'file-saver'
export default {
  exportWord: function (fileName, content) {
    fileName = fileName !== undefined ? fileName : '自动报告'
    var commstr = {
      mhtml: {
        top: 'Mime-Version: 1.0\nContent-Base: ' + location.href + '\nContent-Type: Multipart/related; boundary="NEXT.ITEM-BOUNDARY";type="text/html"\n\n--NEXT.ITEM-BOUNDARY\nContent-Type: text/html; charset="utf-8"\nContent-Location: ' + location.href + '\n\n<!DOCTYPE html>\n<html>\n_html_</html>',
        head: '<head>\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n<style>\n_styles_\n</style>\n</head>\n',
        body: '<body>_body_</body>'
      }
    }
    var options = {
      maxWidth: 624
      // maxWidth:300
    }
    // Clone selected element before manipulating it
    var markup = content

    // eslint-disable-next-line no-array-constructor
    var images = Array()
    // var img = content.getElementsByTagName('img')
    // for (var i = 0; i < img.length; i++) {
    //   // Calculate dimensions of output image
    //   var w = Math.min(img[i].width, options.maxWidth)
    //   var h = img[i].height * (w / img[i].width)
    //   img[i].setAttribute('crossOrigin', 'anonymous')
    //   // Create canvas for converting image to data URL
    //   var canvas = document.createElement('canvas')
    //   canvas.width = w
    //   canvas.height = h
    //   // Draw image to canvas
    //   var context = canvas.getContext('2d')
    //   context.drawImage(img[i], 0, 0, w, h)
    //   // alert(img[i].src)
    //   // Get data URL encoding of image
    //   var uri = canvas.toDataURL('image/png', 1)
    //   img[i].setAttribute('src', img[i].src)
    //   img[i].width = w
    //   img[i].height = h
    //   // Save encoded image to array
    //   images[i] = {
    //     type: uri.substring(uri.indexOf(':') + 1, uri.indexOf(';')),
    //     encoding: uri.substring(uri.indexOf(';') + 1, uri.indexOf(',')),
    //     location: img[i].getAttribute('src'),
    //     data: uri.substring(uri.indexOf(',') + 1)
    //   }
    // }

    var canvases = content.querySelectorAll('canvas')
    // console.log(canvases)
    for (var i = 0; i < canvases.length; i++) {
      var uri = canvases[i].toDataURL('image/png', 1)
      var image = new Image()
      image.src = uri
      image.width = 1300
      image.height = 500
      let parnetNode = canvases[i].parentNode
      parnetNode.insertBefore(image, canvases[i])
      parnetNode.removeChild(canvases[i])
      images[i] = {
        type: uri.substring(uri.indexOf(':') + 1, uri.indexOf(';')),
        encoding: uri.substring(uri.indexOf(';') + 1, uri.indexOf(',')),
        location: image.src,
        data: uri.substring(uri.indexOf(',') + 1)
      }
    }
    // console.log(images)
    // Prepare bottom of mhtml file with image data
    var mhtmlBottom = '\n'
    for (var i = 0; i < images.length; i++) {
      mhtmlBottom += '--NEXT.ITEM-BOUNDARY\n'
      mhtmlBottom += 'Content-Location: ' + images[i].location + '\n'
      mhtmlBottom += 'Content-Type: ' + images[i].type + '\n'
      mhtmlBottom += 'Content-Transfer-Encoding: ' + images[i].encoding + '\n\n'
      mhtmlBottom += images[i].data + '\n\n'
    }
    mhtmlBottom += '--NEXT.ITEM-BOUNDARY--'

    // TODO: load css from included stylesheet
    var styles = ''

    // Aggregate parts of the file together
    var fileContent = commstr.mhtml.top.replace('_html_', commstr.mhtml.head.replace('_styles_', styles) + commstr.mhtml.body.replace('_body_', markup.innerHTML)) + mhtmlBottom

    // Create a Blob with the file contents
    var blob = new Blob([fileContent], {
      type: 'application/msword;charset=utf-8'
    })
    saveAs(blob, fileName + '.doc')
  }
}
