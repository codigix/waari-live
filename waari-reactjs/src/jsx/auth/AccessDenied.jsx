// AccessDenied.js
import React from 'react';
import { Link } from 'react-router-dom';

const AccessDenied = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <h1 className="display-4">Access Denied</h1>
          <p className="lead">You do not have permission to access this page.</p>
          <p>Please contact your administrator for assistance.</p>
          <Link to="/" className="btn btn-primary mt-3">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
