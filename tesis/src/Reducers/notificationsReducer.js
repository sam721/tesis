import actions from '../Actions/actions';
import { store } from 'react-notifications-component';
import React from 'react';
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
      showIcon: true,
    },
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
      'Debe ingresar un numero entero entre -999 y 999',
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
    
    case actions.INVALID_HEAP_ERROR:
      createNotification('Error',
      'El archivo proporcionado no representa un Heap valido. Intente con otro archivo',
      'danger');
      break;

    case actions.INVALID_AVL_ERROR:
      createNotification('Error',
      'El archivo proporcionado no representa un AVL valido. Intente con otro archivo',
      'danger');
      break;
    
    case actions.ANIMATION_RUNNING_ERROR:
      createNotification('Error',
      'No se pueden hacer modificaciones mientras se ejecuta el algoritmo',
      'warning');
      break;
    
    case actions.EMPTY_LIST_WARNING:
      createNotification('La lista se encuentra vacia',
      'No se pudo realizar la accion',
      'warning');
      break;

    case actions.EMPTY_HEAP_WARNING:
      createNotification('Heap vacio',
      'No se puede extraer el minimo elemento de un heap vacio',
      'warning');
      break;
    
    case actions.DIJKSTRA_NEGATIVE_WEIGHT_WARNING:
      createNotification('Cuidado con las aristas con peso negativo',
      'El algoritmo de Dijkstra puede no obtener el camino minimo si hay aristas negativas',
      'warning');
      break;

    case actions.AVL_NOT_FOUND_INFO:
      createNotification('Busqueda terminada',
      'El elemento no fue encontrado en el arbol AVL',
      'info');
      break;

    case actions.AVL_ELEMENT_ALREADY_INFO:
      createNotification('Elemento en el arbol',
      'El elemento ya se encuentra en el arbol AVL',
      'info');
      break;

    case actions.STARTING_ALGORITHM_EXECUTION_INFO:
      createNotification('Ejecucion iniciada',
      ' ',
      'info');
      break;

    case actions.STARTING_GIF_RECORDING_INFO:
      createNotification('Creacion de GIF iniciada',
      'La grabacion tendra una duracion maxima de 30 segundos',
      'info');
      break;
    
    case actions.FINISHED_GIF_RECORDING_INFO:
      createNotification('Grabacion de GIF terminada',
      'Procesando GIF para descargar',
      'info');
      break;

    case actions.SORTING_BINARY_SEARCH_INFO:
      createNotification('Solo arreglos ordenados',
      'Los arreglos se ordenaran para realizar la busqueda binaria',
      'info');
      break;
    
    case actions.BINARY_SEARCH_NOT_FOUND_INFO:
      createNotification('Elemento no encontrado',
      'El elemento no se encuentra en el arreglo',
      'info');
      break;
    
    case actions.FINISHED_GIF_SUCCESS:
      createNotification('Creacion de GIF terminada',
      'El archivo GIF sera descargado a su dispositivo',
      'success');
      break;
    
    case actions.LOAD_GRAPH_SUCCESS:
      createNotification('Grafo cargado con exito',
      ' ',
      'success');
      break;
    
    case actions.PHOTO_SUCCESS:
      createNotification('Captura realizada','La captura sera descargada a su dispositivo','success');
      break;
    
    case actions.FINISHED_ALGORITHM_SUCCESS:
      createNotification('Ejecucion terminada exitosamente',' ','success');
      break;

    case actions.AVL_FOUND_SUCCESS:
      createNotification('Busqueda terminada',
      'El elemento fue encontrado en el arbol AVL',
      'success');
      break;
    
    case actions.BINARY_SEARCH_FOUND_SUCCESS:
      createNotification('Busqueda terminada',
      'El elemento fue encontrado en el arreglo',
      'success');
      break;
  }
}

export default notificationsReducer;