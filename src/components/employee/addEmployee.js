import React from "react";
import { Component } from "react";
import { TextField } from "@material-ui/core";
import { Button } from "@material-ui/core";
import './addEmployee.css';
import EmployeeService from "../../service/EmployeeService";

class AddEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            age: '',
            salary: '',
            address: ''

        };

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleAgeChange = this.handleAgeChange.bind(this);
        this.handleSalaryChange = this.handleSalaryChange.bind(this);
        this.handleAddressChange = this.handleAddressChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.employeeService = new EmployeeService();
    }

    handleNameChange(event) {
        this.setState({ name: event.target.value});
    }

    handleAgeChange(event) {
        this.setState({ age: event.target.value});
    }

    handleSalaryChange(event) {
        this.setState({ salary: event.target.value});
    }

    handleAddressChange(event) {
        this.setState({ address: event.target.value});
    }

    handleSubmit(event) {
       
        this.employeeService.postEmployees(this.state);
        alert('Employee "' + this.state.name + '" has been successfully registered');
        event.preventDefault();
    }

    render() {
        return (
            <div className="form">
                
            <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
            <h3>Enter Employee Details</h3>
                <TextField required type="text" value={this.state.name} onChange={this.handleNameChange} label="Name" variant="outlined" />
                <br/><br/>
                <TextField type="text" value={this.state.age} onChange={this.handleAgeChange} label="Age" variant="outlined" />
                <br/><br/>
                <TextField required id="age" value={this.state.salary} onChange={this.handleSalaryChange} label="Salary" variant="outlined" />
                <br/><br/>
                <TextField type="text" value={this.state.address} onChange={this.handleAddressChange} label="Address" variant="outlined" />
                <br/><br/>
                <Button variant="contained" color="primary" type="submit" value="Submit">
                    Submit
                </Button>
            </form>
            </div>
        );
    }
}

export default AddEmployee;