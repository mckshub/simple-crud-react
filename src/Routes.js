import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";

import AddEmployee from './components/employee/addEmployee'
import EmployeeList from './components/employee/employeeList'
import App from "./App";

import history from './history';
import HomePage from "./components/home/homepage";

export default class Routes extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
               
                    <Route path="/add" component={AddEmployee} />
                    <Route path="/view" component={EmployeeList} />
                </Switch>
            </Router>
        )
    }
}
