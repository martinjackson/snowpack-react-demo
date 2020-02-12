import React from "react";
import ReactDOM from "react-dom";

import Card from './Card.js'


const App = () => <>
                   <Card>First one</Card>
                   <Card>Another one</Card>
                   <Card>Third one</Card>
                   <Card>Hello</Card>
                   </>;

ReactDOM.render(<App />, document.getElementById("app"));
