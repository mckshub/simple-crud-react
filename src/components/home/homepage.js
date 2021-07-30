import React, { Component } from "react";
import { Button } from 'react-bootstrap';
import history from "../../history";
import "./homepage.css";

export default class HomePage extends Component {
  render() {
    return (
      <div className="Home">
        <div className="lander">
          <h1>Employee Data Register</h1>
        </div>
      </div>
    );
  }
}