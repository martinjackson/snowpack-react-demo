import React from "react";
import ReactDOM from "react-dom";

// import css from "./app.css"

const Card = (props) => {
  return <div className='Card'>
          {props.children}
         </div>
}

export default Card;