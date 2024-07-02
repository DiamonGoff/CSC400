import React from 'react';

function Register() {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle registration logic here
    // Example: send data to server, etc.
  };

  return (
    <div className="register-box">
      <h2 className="text-center">Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input type="text" className="form-control" id="username" name="username" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" className="form-control" id="password" name="password" required />
        </div>
        <div className="form-group">
          <label htmlFor="confirm_password">Confirm Password:</label>
          <input type="password" className="form-control" id="confirm_password" name="confirm_password" required />
        </div>
        <input type="submit" value="Sign Up" className="btn btn-primary btn-block" />
      </form>
    </div>
  );
}

export default Register;
