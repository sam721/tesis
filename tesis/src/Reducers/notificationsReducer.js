import actions from '../Actions/actions';
import { store } from 'react-notifications-component';

const createNotification = (title, message, type) => {
  store.addNotification({
    title,
    message,
    type,
    insert: "top",
    container: "top-right",
    animationIn: ["animated", "fadeIn"],
    animationOut: ["animated", "fadeOut"],
    dismiss: {
      duration: 5000,
      onscreen: true,
    }
  });
}

const notificationsReducer = action => {
  switch(action.type){
    case actions.NO_NODE_SELECTED_ERROR:
      createNotification('Error', 
      'Seleccione un nodo para ejecutar el algoritmo',
      'danger');
      break;

    case actions.NO_EDGE_SELECTED_ERROR:
      createNotification('Error',
      'Seleccione una arista para cambiar su peso',
      'danger');
      break;

    case actions.NO_ELEMENT_SELECTED_ERROR:
      createNotification('Error',
      'Debe seleccionar un elemento para eliminarlo',
      'danger');
      break;

    case actions.INVALID_INTEGER_ERROR: 
      createNotification('Error',
      'Debe ingresar un numero entero',
      'danger');
      break;

    case actions.INVALID_ARRAY_ERROR:
      createNotification('Error',
      'El arreglo debe contener numeros enteros separados por comas',
      'danger');
      break;

    case actions.INVALID_GRAPH_ERROR:
      createNotification('Error',
      'Existe un error con el archivo, intente de nuevo con otro archivo',
      'danger');
      break;
    
    case actions.ANIMATION_RUNNING_ERROR:
      createNotification('Error',
      'No se pueden hacer modificaciones mientras se ejecuta el algoritmo',
      'danger');
    default:
      console.log('what');
  }
}

export default notificationsReducer;