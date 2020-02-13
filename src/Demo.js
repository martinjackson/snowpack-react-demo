import React from "react";

const Button = (props) => {
  return <div {...props}>
    {props.children}
  </div>
}

export default function SomeReactComponent(props) {
  return (
    <div className="Demo">
      <header className="Demo-header">
        <img src="/public/logo.svg" className="Demo-logo" alt="logo" />
        <p>
          Edit <code>src/Demo.js</code> and save to reload.a
        </p>
        <Button variant="contained" color="primary">
          Hello World
        </Button>
        <a
          className="Demo-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React but faster
        </a>
      </header>
    </div>
  );
}
