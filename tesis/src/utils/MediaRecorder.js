import dataURItoBlob from './dataURItoBlob';
const gifshot = require('gifshot');
class MediaRecorder{

  _gifBuffer = [];
  _takingGif = false;
  _interval = 0;

  downloadGif = (buffer, width, height) => {
    gifshot.createGIF({
      'images': buffer,
      'gifWidth': width,
      'gifHeight': height,
      'frameDuration': 1,
      }, function(obj) {
        if(!obj.error) {
          const image = dataURItoBlob(obj.image);
    
          let link = document.createElement('a');
          link.setAttribute('href', window.URL.createObjectURL(image));
          link.setAttribute('download', 'test.gif');
          link.setAttribute('target', '_blank');
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    );
  }
  takePicture(_this, cy, download = true){
    console.log('Taking picture');
    let image = cy.jpg();
    if(download){
      let link = document.createElement('a');
      link.setAttribute('href', image);
      link.setAttribute('download', 'test.jpg');
      link.setAttribute('target', '_blank');
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }else _this._gifBuffer.push(image);
  }

  takeGif(cy){
    if(!this._takingGif){
      this._takingGif = true;
      this._interval = setInterval(this.takePicture, 100, this, cy, false);
    }else{
      clearInterval(this._interval);
      this.downloadGif(this._gifBuffer, cy.width(), cy.height());
      this._takingGif = false;
      this._gifBuffer = [];
    }
  }

  takeJson(cy){
    const graphCy = cy.json();
    const graph = JSON.stringify({
      elements: graphCy.elements,
    });
    
    let link = document.createElement('a');
    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(graph));
    link.setAttribute('download', 'graph.json');
    link.setAttribute('target', '_blank');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  readJson(cy){
    /*
    const graph = prompt("Insertar grafo en formato JSON");
    if(graph){
      console.log(JSON.parse(graph));
      cy.json(JSON.parse(graph));
    }
    */
   let input = document.createElement('input');
   input.setAttribute('type', 'file');
   input.setAttribute('id','myFile');
   input.setAttribute('style', 'position: absolute');
   document.body.appendChild(input);
   input.click();
   console.log(input.value);
  }
}

export default MediaRecorder;