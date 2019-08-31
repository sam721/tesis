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
        }else{
          console.log(obj.error);
        }
      }
    );
  }
  takePicture(cy, _this = null, download = true){
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
    }else if(_this._gifBuffer.length < 600) _this._gifBuffer.push(image);
  }

  cancelGif(){
    this._takingGif = false;
    clearInterval(this._interval);
  }

  takeGif(cy){
    if(!this._takingGif){
      this._takingGif = true;
      this._interval = setInterval(this.takePicture, 100, cy, this, false);
    }else{
      clearInterval(this._interval);
      console.log(this._gifBuffer.length);
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