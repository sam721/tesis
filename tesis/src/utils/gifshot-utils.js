import dataURItoBlob from './dataURItoBlob';
const gifshot = require('gifshot');

const downloadGif = (buffer, width, height) => {
  console.log(buffer.length);
  gifshot.createGIF({
    'images': buffer,
    'gifWidth': width,
    'gifHeight': height,
    'frameDuration': 1,
  },function(obj) {
    if(!obj.error) {
      const image = dataURItoBlob(obj.image);

      let link = document.createElement('a');
			link.setAttribute('href', window.URL.createObjectURL(image));
			link.setAttribute('download', 'test.gif');
			link.setAttribute('target', '_blank');
			link.style.display = 'none';
			document.body.appendChild(link);
			link.click();
    }
  }
  );
}
  
export default downloadGif;