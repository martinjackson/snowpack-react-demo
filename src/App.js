import React from "react";
import ReactDOM from "react-dom";

import Card from './Card.js'
import Demo from './demo/Demo.js'


const App = () => <>
                   <Card>First one</Card>
                   <Card>Another one</Card>
                   <Card>Third one</Card>
                   <Card>Hello</Card>
                   <Card>Bye</Card>
                   <Demo />
                   </>;

ReactDOM.render(<App />, document.getElementById("app"));
