import React from "react";
import ReactDOM from "react-dom";

// import css from "./app.css"

const Card = (props) => {
  return <div className='Card'>
          {props.children}
         </div>
}

const App = () => <>
                   <Card>First one</Card>
                   <Card>Another one</Card>
                   <Card>Third one</Card>
                   </>;

ReactDOM.render(<App />, document.getElementById("app"));
