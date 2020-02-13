import React from "react";
import ReactDOM from "react-dom";

// dont import css from  "./Card.css"
// babel-watch will put it in index.html

const Card = (props) => {
  return <div className='Card'>
          {props.children}
         </div>
}

export default Card;