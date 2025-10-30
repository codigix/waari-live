export const updateFormData = (formData) => ({
    type: 'UPDATE_FORM_DATA',
    payload: formData,
  });

  export const removeFormData = () => ({
    type: 'REMOVE_FORM_DATA',
  });