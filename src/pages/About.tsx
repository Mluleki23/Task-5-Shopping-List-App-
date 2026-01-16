import "../App.css";

export default function About() {
  return (
    <div className="page-container">
      <div className="form-container">
        <h1>About Our Shopping List App</h1>
        <p>
          Welcome to our Shopping List App! This application helps you organize your shopping needs efficiently.
          You can create multiple shopping lists, add items to them, mark items as completed, and manage everything
          from your personal dashboard.
        </p>
        <h2>Features</h2>
        <ul>
          <li>Create and manage multiple shopping lists</li>
          <li>Add, edit, and delete items in your lists</li>
          <li>Mark items as completed</li>
          <li>User authentication and personal accounts</li>
          <li>Data persistence with local storage and server backup</li>
        </ul>
        <h2>Technology</h2>
        <p>
          Built with React, TypeScript, Redux for state management, and styled with CSS.
          Data is stored on a JSON server for persistence.
        </p>
      </div>
    </div>
  );
}