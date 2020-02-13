import React from "react";
import ReactDOM from "react-dom";

import Card from './Card.js'
import Demo from './Demo.js'


const App = () => <>
                   <Card>First one</Card>
                   <Card>Another one</Card>
                   <Card>Third one</Card>
                   <Card>Hello</Card>
                   <Demo />
                   </>;

ReactDOM.render(<App />, document.getElementById("app"));
