const singlyLinkedList = [
  { text: 'ListaEnlazada{', ind: 0},
  { text: 'Nodo* inicio', ind: 1},
  { text: 'ExtraerPrimero()', ind: 1},
  { text: 'ExtraerUltimo()', ind: 1},
  { text: 'InsertarPrimero(Entero v)', ind: 1},
  { text: 'InsertarUltimo(Entero v)', ind: 1},
  { text: 'Eliminar(Nodo* p)', ind: 1},
  { text: 'InsertarAntesDe(Nodo* p, Entero v)', ind: 1},
  { text: 'InsertarDespuesDe(Nodo* p, Entero v)', ind: 1},
  { text: '}', ind: 0},
  { text: '\u2063', ind: 0},
  { text: 'Nodo{', ind: 0},
  { text: 'Entero v', ind: 1},
  { text: 'Nodo *sig', ind: 1},
  { text: '}', ind: 0},
];

const doublyLinkedList = [
  { text: 'ListaDoblementeEnlazada{', ind: 0},
  { text: 'Nodo *primero, *ultimo', ind: 1},
  { text: 'ExtraerPrimero()', ind: 1},
  { text: 'ExtraerUltimo()', ind: 1},
  { text: 'InsertarPrimero(Entero v)', ind: 1},
  { text: 'InsertarUltimo(Entero v)', ind: 1},
  { text: 'Eliminar(Nodo* p)', ind: 1},
  { text: 'InsertarAntesDe(Nodo* p, Entero v)', ind: 1},
  { text: 'InsertarDespuesDe(Nodo* p, Entero v)', ind: 1},
  { text: '}', ind: 0},
  { text: '\u2063', ind: 0},
  { text: 'Nodo{', ind: 0},
  { text: 'Entero v', ind: 1},
  { text: 'Nodo *ant, *sig', ind: 1},
  { text: '}', ind: 0},
]

const queue = [
  { text: 'Cola{', ind: 0},
  { text: 'Nodo *frente, *final', ind: 1},
  { text: 'Encolar(Entero v)', ind: 1},
  { text: 'Desencolar()', ind: 1},
  { text: '}', ind: 0},
  { text: '\u2063', ind: 0},
  { text: 'Nodo{', ind: 0},
  { text: 'Entero v', ind: 1},
  { text: 'Nodo *sig', ind: 1},
  { text: '}', ind: 0}
];

const queuePush = [
  { text: 'Encolar(Entero v):', ind: 0},
  { text: 'Nodo *aux = nuevo Nodo(v)', ind: 1},
  { text: 'Si frente==NULL:', ind: 1},
  { text: 'frente=final=aux', ind : 2},
  { text: 'Sino:', ind: 1},
  { text: 'final->sig=aux', ind: 2},
  { text: 'final=aux', ind: 2},
];

const queuePop = [
  { text: 'Desencolar():', ind: 0},
  { text: 'Si frente==NULL: retornar', ind: 1},
  { text: 'Nodo *aux = frente->sig'},
  { text: 'Si frente==NULL: ', ind: 1},
  { text: 'ultimo=NULL', ind: 2},
  { text: 'Sino:', ind: 1},
  { text: 'frente=frente->sig', ind: 2},
  { text: 'retornar aux', ind: 1},
];

const stack = [
  { text: 'Pila{', ind: 0},
  { text: 'Nodo *tope', ind: 1},
  { text: 'Apilar(Entero v)', ind: 1},
  { text: 'Desapilar(Entero v)', ind: 1},
  { text: '}', ind: 0},
  { text: '\u2063', ind: 0},
  { text: 'Nodo{', ind: 0},
  { text: 'Entero v', ind: 1},
  { text: 'Nodo *sig', ind: 1},
  { text: '}', ind: 0}
];

const stackPush = [
  { text: 'Apilar(Entero v):', ind: 0},
  { text: 'Nodo *aux = nuevo Nodo(v)', ind: 1},
  { text: 'Si tope==NULL:', ind : 1},
  { text: 'tope=aux', ind: 2},
  { text: 'Sino:', ind: 1},
  { text: 'aux->sig=tope', ind: 2},
  { text: 'tope=aux', ind: 2},
];

const stackPop = [
  { text: 'Desapilar():', ind: 0},
  { text: 'Si tope==NULL: retornar', ind: 1},
  { text: 'Nodo *aux=tope', ind: 1},
  { text: 'tope=tope->sig', ind: 1},
  { text: 'retornar aux', ind: 1},
]
const singlyPopFront = [
  { text: 'ExtraerFrente():', ind: 0},
  { text: 'Si inicio == NULL: retornar', ind: 1},
  { text: 'nodo* aux=inicio', ind: 1},
  { text: 'inicio=inicio->sig', ind: 1},
  { text: 'retornar aux', ind: 1},
];

const doublyPopFront = [
  { text: 'ExtraerFrente():', ind: 0},
  { text: 'Si primero == NULL: retornar', ind: 1},
  { text: 'nodo* aux=primero', ind: 1},
  { text: 'primero=primero->sig', ind: 1},
  { text: 'Si primero==NULL:', ind: 1},
  { text: 'ultimo=NULL', ind: 2},
  { text: 'Sino:', ind: 1},
  { text: 'primero->ant=NULL', ind: 2},
  { text: 'retornar aux', ind: 1},
];

const singlyPopBack = [
  { text: 'ExtraerUltimo():', ind: 0},
  { text: 'Si inicio == NULL: retornar', ind: 1},
  { text: 'Si inicio->sig == NULL:', ind: 1},
  { text: 'Nodo* aux = inicio', ind: 2},
  { text: 'inicio=NULL', ind: 2},
  { text: 'retornar aux', ind: 2},
  { text: 'nodo *actual = inicio, *anterior', ind: 1},
  { text: 'Mientras(actual->sig != NULL):', ind: 1},
  { text: 'anterior=actual', ind: 2},
  { text: 'actual=actual->sig', ind: 2},
  { text: 'anterior->sig=NULL', ind: 1},
  { text: 'retornar actual', ind: 1}
];

const doublyPopBack = [
  { text: 'ExtraerUltimo():', ind: 0},
  { text: 'Si inicio == NULL: retornar', ind: 1},
  { text: 'nodo* aux=ultimo', ind: 1},
  { text: 'ultimo=ultimo->ant', ind: 1},
  { text: 'Si ultimo==NULL:', ind: 1},
  { text: 'inicio=NULL', ind: 2},
  { text: 'Sino:', ind: 1},
  { text: 'ultimo->sig=NULL', ind: 2},
  { text: 'retornar aux', ind: 1},
];

const singlyPushFront = [
  { text: 'InsertarPrimero(Entero v):', ind: 0},
  { text: 'Nodo *p = nuevo Nodo(v)', ind: 1},
  { text: 'Si inicio==NULL', ind: 1},
  { text: 'inicio=p', ind: 2},
  { text: 'Sino:', ind: 1},
  { text: 'p->sig=inicio', ind: 2},
  { text: 'inicio=p', ind: 2},
];

const doublyPushFront = [
  { text: 'InsertarPrimero(Entero v):', ind: 0},
  { text: 'Nodo *p = nuevo Nodo(v)', ind: 1},
  { text: 'Si primero==NULL', ind: 1},
  { text: 'primero=ultimo=p', ind: 2},
  { text: 'Sino:', ind: 1},
  { text: 'p->sig=primero', ind: 2},
  { text: 'primero->ant=p', ind: 2},
  { text: 'primero=p', ind: 2},
];

const singlyPushBack = [
  { text: 'InsertarUltimo(Entero v):', ind: 0},
  { text: 'Nodo *p = nuevo Nodo(v)', ind: 1},
  { text: 'Si inicio==NULL', ind: 1},
  { text: 'inicio=p', ind: 2},
  { text: 'Sino:', ind: 1},
  { text: 'nodo *actual = inicio', ind: 2},
  { text: 'Mientras(actual->sig != NULL):', ind: 2},
  { text: 'actual=actual->sig', ind: 3},
  { text: 'actual->sig=p', ind: 2},
];

const doublyPushBack = [
  { text: 'InsertarUltimo(Entero v):', ind: 0},
  { text: 'Nodo *p = nuevo Nodo(v)', ind: 1},
  { text: 'Si primero==NULL', ind: 1},
  { text: 'primero=ultimo=p', ind: 2},
  { text: 'Sino:', ind: 1},
  { text: 'ultimo->sig=p', ind: 2},
  { text: 'p->ant=ultimo', ind: 2},
  { text: 'ultimo=p', ind: 2},
];

const singlyRemove = [
  { text: 'Eliminar(Nodo *p):', ind: 0},
  { text: 'Si inicio==p:', ind: 1},
  { text: 'inicio=inicio->sig', ind: 2},
  { text: 'borrar p', ind: 2},
  { text: 'Sino:', ind: 1},
  { text: 'Nodo *actual=incio, *anterior=NULL', ind: 2},
  { text: 'Mientras actual != p:', ind: 2},
  { text: 'anterior=actual', ind: 3},
  { text: 'actual=actual->sig', ind: 3},
  { text: 'anterior->sig=p->sig', ind: 2},
  { text: 'borrar p', ind: 2},
];

const doublyRemove = [
  { text: 'Eliminar(Nodo *p):', ind: 0},
  { text: 'Nodo *ant=p->ant, *sig=p->sig', ind: 1},
  { text: 'Caso 1: ant==NULL y sig==NULL:', ind: 1},
  { text: 'primero=ultimo=NULL', ind: 2},
  { text: 'Caso 2: ant==NULL y sig!=NULL', ind: 1},
  { text: 'primero=sig', ind: 2},
  { text: 'Caso 3: ant!=NULL y sig==NULL:', ind: 1},
  { text: 'ultimo=ant', ind: 2},
  { text: 'Caso 4: ant!=NULL y sig!=NULL', ind : 1},
  { text: 'ant->sig=sig, sig->ant=ant', ind: 2},
  { text: 'borrar p', ind: 1},
];

const singlyInsertBefore = [
  { text: 'InsertarAntesDe(Nodo *p, Entero v):', ind: 0},
  { text: 'Nodo *aux = nuevo Nodo(v)', ind: 1},
  { text: 'Si inicio==p', ind: 1},
  { text: 'aux->sig=inicio', ind: 2},
  { text: 'inicio=aux', ind: 2},
  { text: 'sino:', ind: 1},
  { text: 'Nodo *actual=inicio', ind: 2},
  { text: 'Mientras actual->sig != p:', ind: 2},
  { text: 'actual=actual->sig', ind: 3},
  { text: 'actual->sig=aux', ind: 2},
  { text: 'aux->sig=p', ind: 2},
];

const doublyInsertBefore = [
  { text: 'InsertarAntesDe(Nodo *p, Entero v):', ind: 0},
  { text: 'Nodo *aux = nuevo Nodo(v)', ind: 1},
  { text: 'Nodo *ant = p->ant', ind: 1},
  { text: 'aux->sig=p, aux->ant=ant', ind: 1},
  { text: 'p->ant=aux', ind: 1},
  { text: 'Si ant == NULL:', ind: 1},
  { text: 'primero=aux', ind: 2},
  { text: 'Sino:', ind: 1},
  { text: 'ant->sig=aux', ind: 2},
];

const singlyInsertAfter = [
  { text: 'InsertarDespuesDe(Nodo *p, Entero v):', ind: 0},
  { text: 'Nodo *aux = nuevo Nodo(v)', ind: 1},
  { text: 'Nodo *s = p->sig', ind: 1},
  { text: 'p->sig=aux', ind: 1},
  { text: 'aux->sig=s', ind: 1},
];

const doublyInsertAfter = [
  { text: 'InsertarDespuesDe(Nodo *p, Entero v):', ind: 0},
  { text: 'Nodo *aux = nuevo Nodo(v)', ind: 1},
  { text: 'Nodo *sig = p->sig', ind: 1},
  { text: 'aux->ant=p, aux->sig=sig', ind: 1},
  { text: 'p->sig=aux', ind: 1},
  { text: 'Si sig == NULL:', ind: 1},
  { text: 'ultimo=aux', ind: 2},
  { text: 'Sino:', ind: 1},
  { text: 'sig->ant=aux', ind: 2},
];


const singlySet = {
  main: singlyLinkedList,
  pushFront: singlyPushFront,
  pushBack: singlyPushBack,
  popFront: singlyPopFront,
  popBack: singlyPopBack,
  insertBefore: singlyInsertBefore,
  insertAfter: singlyInsertAfter,
  remove: singlyRemove,
}

const doublySet = {
  main: doublyLinkedList,
  pushFront: doublyPushFront,
  pushBack: doublyPushBack,
  popFront: doublyPopFront,
  popBack: doublyPopBack,
  insertBefore: doublyInsertBefore,
  insertAfter: doublyInsertAfter,
  remove: doublyRemove,
}

const queueSet = {
  main: queue,
  pushFront: [],
  pushBack: queuePush,
  popFront: queuePop,
  popBack: [],
  insertBefore: [],
  insertAfter: [],
  remove: [],
}

const stackSet = {
  main: stack,
  pushFront: stackPush,
  pushBack: [],
  popFront: stackPop,
  popBack: [],
  insertBefore: [],
  insertAfter: [],
  remove: [],
}

export default {
  singlySet, doublySet, queueSet, stackSet,
};