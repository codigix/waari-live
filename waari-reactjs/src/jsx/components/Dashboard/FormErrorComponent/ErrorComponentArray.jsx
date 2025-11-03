export const ErrorComponentArray = ({ touched, errors, index, fieldName, isTouchedOptional = false }) => {
  return (
    (isTouchedOptional || (touched && touched[index]?.[fieldName])) &&
    errors &&
    errors[index]?.[fieldName] && (
      <span className="error">
        {errors[index]?.[fieldName]}
      </span>
    )
  );
};