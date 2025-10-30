// PrivateRoute.js
import React from "react";
import { Route, Navigate } from "react-router-dom";

// ✅ Safer version of hasComponentPermission
export const hasComponentPermission = (permissions, listId) => {
  if (!Array.isArray(permissions)) {
    console.warn("Permissions is not an array:", permissions);
    return false;
  }
  return permissions.some(
    (permission) =>
      Array.isArray(permission.listId) && permission.listId.includes(listId)
  );
};

export const hasMenuPermission = (permissions, content) => {
  console.log("Checking menu permission with:", { permissions, content });
  if (!Array.isArray(permissions) || !Array.isArray(content)) {
    console.warn("Invalid permissions or content:", { permissions, content });
    return false;
  }

  const catIds = content.map((c) => c.catId);

  for (let i = 0; i < permissions.length; i++) {
    if (catIds.includes(permissions[i].catId)) {
      if (Array.isArray(permissions[i].listId) && permissions[i].listId.length > 0) {
        return true;
      }
    }
  }
  return false;
};

export const hasSubMenuPermission = (permissions, catId) => {
  if (!Array.isArray(permissions)) {
    console.warn("Permissions is not an array:", permissions);
    return false;
  }

  for (let i = 0; i < permissions.length; i++) {
    if (permissions[i].catId === catId) {
      if (Array.isArray(permissions[i].listId) && permissions[i].listId.length > 0) {
        return true;
      }
    }
  }
  return false;
};

// Example PrivateRoute usage
// Make sure to pass permissions and requiredPermissions correctly
// (requiredPermissions should be an array of { catId, listId })
//
// const PrivateRoute = ({ element: Element, permissions, requiredPermissions, ...rest }) => {
//   const hasPermission = Array.isArray(requiredPermissions)
//     ? requiredPermissions.every((perm) =>
//         hasComponentPermission(permissions, perm.listId)
//       )
//     : false;
//
//   return (
//     <Route
//       {...rest}
//       element={
//         hasPermission ? <Element /> : <Navigate to="/access-denied" replace />
//       }
//     />
//   );
// };
//
// export default PrivateRoute;
