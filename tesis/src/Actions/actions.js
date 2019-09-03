const actions = {
    SELECT_BFS: 'SELECT_BFS',
    SELECT_DFS: 'SELECT_DFS',
    SELECT_DIJKSTRA: 'SELECT_DIJKSTRA',
    SELECT_KRUSKAL: 'SELECT_KRUSKAL',
    SELECT_PRIM: 'SELECT_PRIM',
    SELECT_HEAP: 'SELECT_HEAP',
    SELECT_AVL: 'SELECT_AVL',
    SELECT_BUBBLESORT: 'SELECT_BUBBLESORT',
    SELECT_MERGESORT: 'SELECT_MERGESORT',
    SELECT_BINARY_SEARCH: 'SELECT_BINARY_SEARCH',
    SELECTION: 'SELECTION',
    NO_SELECTION: 'NO_SELECTION',
    ANIMATION_START: 'ANIMATION_START',
    ANIMATION_END: 'ANIMATION_END',
    CLEAR_GRAPH: 'CLEAR_GRAPH',
    
    CHANGE_PSEUDO: 'CHANGE_PSEUDO',
    SHOW_PSEUDO: 'SHOW_PSEUDO',
    CLOSE_PSEUDO: 'CLOSE_PSEUDO',
    INC_SPEED: 'INC_SPEED',
    DEC_SPEED: 'DEC_SPEED',
    CHANGE_SPEED: 'CHANGE_SPEED',

    CHANGE_LINE: 'CHANGE_LINE',

    LOAD_GRAPH: 'LOAD_GRAPH',
    FINISHED_LOAD: 'FINISHED_LOAD',
    INC_GIF_LENGTH: 'INC_GIF_LENGTH',
    RESET_GIF_LENGTH: 'RESET_GIF_LENGTH',
    
    NO_NODE_SELECTED_ERROR: 'NO_NODE_SELECTED_ERROR',
    NO_EDGE_SELECTED_ERROR: 'NO_EDGE_SELECTED_ERROR',
    NO_ELEMENT_SELECTED_ERROR: 'NO_ELEMENT_SELECTED_ERROR',
    INVALID_INTEGER_ERROR: 'INVALID_INTEGER_ERROR',
    INVALID_ARRAY_ERROR: 'INVALID_ARRAY_ERROR',
    INVALID_GRAPH_ERROR: 'INVALID_GRAPH_ERROR',
    ANIMATION_RUNNING_ERROR: 'ANIMATION_RUNNING_ERROR',

    EMPTY_HEAP_WARNING: 'EMPTY_HEAP_WARNING',
    DIJKSTRA_NEGATIVE_WEIGHT_WARNING: 'DIJKSTRA_NEGATIVE_WEIGHT_WARNING',

    AVL_NOT_FOUND_INFO: 'AVL_NOT_FOUND_INFO',
    AVL_ELEMENT_ALREADY_INFO: 'AVL_ELEMENT_ALREADY_INFO',
    STARTING_ALGORITHM_EXECUTION_INFO: 'STARTING_ALGORITHM_EXECUTION',
    STARTING_GIF_RECORDING_INFO: 'STARTING_GIF_RECORDING_INFO',
    FINISHED_GIF_RECORDING_INFO: 'FINISHED_GIF_RECORDING_INFO',
    SORTING_BINARY_SEARCH_INFO: 'SORTING_BINARY_SEARCH_INFO',
    BINARY_SEARCH_NOT_FOUND_INFO: 'BINARY_SEARCH_NOT_FOUND_INFO',

    FINISHED_GIF_SUCCESS: 'FINISHED_GIF_SUCCESS',
    LOAD_GRAPH_SUCCESS: 'LOAD_GRAPH_SUCCESS',
    PHOTO_SUCCESS: 'PHOTO_SUCCESS',
    FINISHED_ALGORITHM_SUCCESS: 'FINISHED_ALGORITHM_SUCCESS',
    AVL_FOUND_SUCCESS: 'AVL_FOUND_SUCCESS',
    BINARY_SEARCH_FOUND_SUCCESS: 'BINARY_SEARCH_FOUND_SUCCESS',
    
}
export default actions;