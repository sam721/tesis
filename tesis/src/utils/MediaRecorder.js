import dataURItoBlob from './dataURItoBlob';
import actions from '../Actions/actions';
const gifshot = require('gifshot');
class MediaRecorder{

  _gifBuffer = [];
  _takingGif = false;
  _interval = 0;
  _dispatch = null;
  
  constructor(dispatch = (_action) => {}){
    this._dispatch = dispatch;
  }

  downloadGif = (buffer, width, height) => {
    const dispatch = this._dispatch;
    try{
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
            dispatch({
              type: actions.FINISHED_GIF_SUCCESS,
            });
            dispatch({
              type: actions.FINISHED_GIF_ENCODING,
            });
          }else{
            dispatch({
              type: actions.FINISHED_GIF_SUCCESS,
            });
            
            console.log(obj.error);
          }
        }
      );
    }catch(error){
      console.log(error);
      dispatch({
        type: actions.FINISHED_GIF_ENCODING,
      });
      dispatch({
        type: actions.GIF_ENCODING_ERROR,
      });
    }
  }
  takePicture(cy, _this = null, download = true){
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
    }else if(_this._gifBuffer.length < 300){
      _this._gifBuffer.push(image);
      _this._dispatch({
        type: actions.INC_GIF_LENGTH,
      });
    }else{
      _this.takeGif(cy);
    }
  }

  cancelGif(){
    this._takingGif = false;
    this._dispatch({type: actions.RESET_GIF_LENGTH});
    clearInterval(this._interval);
  }

  takeGif(cy){
    if(!this._takingGif){
      this._takingGif = true;
      this._dispatch({type: actions.STARTING_GIF_RECORDING_INFO});
      this._interval = setInterval(this.takePicture, 300, cy, this, false);
    }else{
      clearInterval(this._interval);
      this._dispatch({type: actions.FINISHED_GIF_RECORDING_INFO});
      this._dispatch({type: actions.RESET_GIF_LENGTH});
      this._dispatch({type: actions.START_GIF_ENCODING});
      this.downloadGif(this._gifBuffer, cy.width(), cy.height());
      this._takingGif = false;
      this._gifBuffer = [];
    }
  }

  takeJson(elements){
   
    const graph = JSON.stringify(elements); 
    let link = document.createElement('a');
    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(graph));
    link.setAttribute('download', 'graph.json');
    link.setAttribute('target', '_blank');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  readJson(){
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