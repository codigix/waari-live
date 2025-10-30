import React from 'react'

function ErrorMessageComponent({ touched, errors, fieldName }) {
  return (
    touched && touched[fieldName] && errors && errors[fieldName] && (
        <span className="error">
          {errors[fieldName]}
        </span>
      )
  )
}

export default ErrorMessageComponent

 
  