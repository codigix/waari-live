// FormReducer.js
const initialState = {
    formData: {},
  };
  
  const formReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'UPDATE_FORM_DATA':
        return {
          ...state,
          formData: action.payload,
        };
      case 'REMOVE_FORM_DATA':
        return {
          ...state,
          formData: {},
        };
      default:
        return state;
    }
  };
  
  export default formReducer;
  