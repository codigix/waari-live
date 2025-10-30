import { toast } from "react-toastify";
import { isObject } from "lodash";

// Function to scroll to the first input field with an error
export const scrollIntoViewHelper = (errors) => {
	// Find the first error
	const firstError = findFirstError(errors);
	
	// If there is an error
	if (firstError) {
		// Get the error message
		const errorMessage = getErrorMessage(errors);
		
		// Display the error message as a toast notification
		// toast.error(errorMessage);
		// toast.error("Enter the mandatory fields ");

		// Scroll to the input field with the error
		let el = document.querySelector(`[name="${firstError}"]`);
		if (el) {
			el.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
		}
	}
};

// Recursive function to find the first error in nested error objects
const findFirstError = (errors) => {
	for (const key in errors) {
		if (errors.hasOwnProperty(key)) {
			const error = errors[key];
			if (isObject(error)) {
				// If the error is an object, recursively search for the first error
				const nestedError = findFirstError(error);
				if (nestedError) {
					return nestedError;
				}
			} else {
				// If the error is not an object, return the key (field name)
				return key;
			}
		}
	}
	// If no error is found, return null
	return null;
};

// Function to get the error message from nested errors
const getErrorMessage = (error) => {

	if (isObject(error)) {
		// If the error is an object, recursively get the error message
		return getErrorMessage(Object.values(error)[0]);
	} else if (Array.isArray(error)) {
		// If the error is an array, recursively get the error message
		return getErrorMessage(error[0]);
	} else {
		// If the error is a string, return the error message
		return error;
	}
};
