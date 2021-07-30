import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import '../../index.css';
import ReactDOM from 'react-dom';

import React, { Component } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import EmployeeService from '../../service/EmployeeService';
import './employeeList.css';

export class EmployeeList extends Component {

    emptyEmployee = {
        id: null,
        name: '',
        age: '',
        salary: '',
        address: ''
    };

    constructor(props) {
        super(props);

        this.state = {
            employees: null,
            employeeDialog: false,
            deleteEmployeeDialog: false,
            deleteEmployeesDialog: false,
            employee: this.emptyEmployee,
            selectedEmployees: null,
            submitted: false,
            globalFilter: null
        };

        this.employeeService = new EmployeeService();
        this.leftToolbarTemplate = this.leftToolbarTemplate.bind(this);
        this.rightToolbarTemplate = this.rightToolbarTemplate.bind(this);
        this.actionBodyTemplate = this.actionBodyTemplate.bind(this);

        this.openNew = this.openNew.bind(this);
        this.hideDialog = this.hideDialog.bind(this);
        this.saveEmployee = this.saveEmployee.bind(this);
        this.editEmployee = this.editEmployee.bind(this);/*  */
        this.confirmDeleteEmployee = this.confirmDeleteEmployee.bind(this);
        this.deleteEmployee = this.deleteEmployee.bind(this);
        this.exportCSV = this.exportCSV.bind(this);
        this.confirmDeleteSelected = this.confirmDeleteSelected.bind(this);
        this.deleteSelectedEmployees = this.deleteSelectedEmployees.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.onInputNumberChange = this.onInputNumberChange.bind(this);
        this.hideDeleteEmployeeDialog = this.hideDeleteEmployeeDialog.bind(this);
        this.hideDeleteEmployeesDialog = this.hideDeleteEmployeesDialog.bind(this);

    }

    componentDidMount() {
        this.employeeService.getEmployees().then(data => this.setState({ employees: data }));
    }

    formatCurrency(value) {
        return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
    }

    openNew() {
        this.setState({
            employee: this.emptyEmployee,
            submitted: false,
            employeeDialog: true
        });
    }

    hideDialog() {
        this.setState({
            submitted: false,
            employeeDialog: false
        });
    }

    hideDeleteEmployeeDialog() {
        this.setState({ deleteEmployeeDialog: false });
    }

    hideDeleteEmployeesDialog() {
        this.setState({ deleteEmployeesDialog: false });
    }

    saveEmployee() {
        let state = { submitted: true };

        if (this.state.employee.name.trim()) {
            let employees = [...this.state.employees];
            let employee = { ...this.state.employee };
            if (this.state.employee.id) {
                const index = this.findIndexById(this.state.employee.id);

                employees[index] = employee;
                this.toast.show({ severity: 'success', summary: 'Successful', detail: 'Employee Updated', life: 3000 });
            }
            else {
                employee.id = this.createId();
                employees.push(employee);
                this.toast.show({ severity: 'success', summary: 'Successful', detail: 'Employee Created', life: 3000 });
            }

            state = {
                ...state,
                employees,
                employeeDialog: false,
                employee: this.emptyEmployee
            };
            this.employeeService.updateEmployees(this.state.employee.id, this.state.employee);
        }

        this.setState(state);
        this.employeeService.postEmployees(this.state.employee);
    }

    editEmployee(employee) {
        this.setState({
            employee: { ...employee },
            employeeDialog: true
        });
    }

    confirmDeleteEmployee(employee) {
        this.setState({
            employee,
            deleteEmployeeDialog: true
        });
    }

    deleteEmployee() {
        let employees = this.state.employees.filter(val => val.id !== this.state.employee.id);
        this.setState({
            employees,
            deleteEmployeeDialog: false,
            employee: this.emptyEmployee
        });
        this.toast.show({ severity: 'success', summary: 'Successful', detail: 'Employee Deleted', life: 3000 });
        this.employeeService.deleteEmployees(this.state.employee.id);
    }

    findIndexById(id) {
        let index = -1;
        for (let i = 0; i < this.state.employees.length; i++) {
            if (this.state.employees[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId() {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    exportCSV() {
        this.dt.exportCSV();
    }

    confirmDeleteSelected() {
        this.setState({ deleteEmployeesDialog: true });
    }

    deleteSelectedEmployees() {
        let employees = this.state.employees.filter(val => !this.state.selectedEmployees.includes(val));
        this.setState({
            employees,
            deleteEmployeesDialog: false,
            selectedEmployees: null
        });
        for(var i=0; i < this.state.selectedEmployees.length; i++){
            this.employeeService.deleteEmployees(this.state.selectedEmployees[i].id);
        }
        this.toast.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
        
    }


    onInputChange(e, name) {
        const val = (e.target && e.target.value) || '';
        let employee = { ...this.state.employee };
        employee[`${name}`] = val;

        this.setState({ employee });
        
    }

    onInputNumberChange(e, name) {
        const val = e.value || 0;
        let employee = { ...this.state.employee };
        employee[`${name}`] = val;

        this.setState({ employee });
    }

    leftToolbarTemplate() {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" className="p-button-success p-mr-2" onClick={this.openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={this.confirmDeleteSelected} disabled={!this.state.selectedEmployees || !this.state.selectedEmployees.length} />
            </React.Fragment>
        )
    }

    rightToolbarTemplate() {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="p-mr-2 p-d-inline-block" />
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={this.exportCSV} />
            </React.Fragment>
        )
    }

    actionBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => this.editEmployee(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => this.confirmDeleteEmployee(rowData)} />
            </React.Fragment>
        );
    }

    render() {
        const header = (
            <div className="table-header">
                <h5 className="p-m-0">Manage Employees</h5>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Search..." />
                </span>
            </div>
        );
        const employeeDialogFooter = (
            <React.Fragment>
                <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={this.hideDialog} />
                <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={this.saveEmployee} />
            </React.Fragment>
        );
        const deleteEmployeeDialogFooter = (
            <React.Fragment>
                <Button label="No" icon="pi pi-times" className="p-button-text" onClick={this.hideDeleteEmployeeDialog} />
                <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={this.deleteEmployee} />
            </React.Fragment>
        );
        const deleteEmployeesDialogFooter = (
            <React.Fragment>
                <Button label="No" icon="pi pi-times" className="p-button-text" onClick={this.hideDeleteEmployeesDialog} />
                <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={this.deleteSelectedEmployees} />
            </React.Fragment>
        );

        return (
            <div className="datatable-crud-demo">
                <Toast ref={(el) => this.toast = el} />

                <div className="card">
                    <Toolbar className="p-mb-4" left={this.leftToolbarTemplate} right={this.rightToolbarTemplate}></Toolbar>

                    <DataTable ref={(el) => this.dt = el} value={this.state.employees} selection={this.state.selectedEmployees} onSelectionChange={(e) => this.setState({ selectedEmployees: e.value })}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} employees"
                        globalFilter={this.state.globalFilter}
                        header={header}>

                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                        <Column field="id" header="ID" sortable></Column>
                        <Column field="name" header="Name" sortable></Column>
                        <Column field="age" header="Age" sortable integeronly></Column>
                        <Column field="salary" header="Salary" sortable currency></Column>
                        <Column field="address" header="Address"></Column>
                        <Column body={this.actionBodyTemplate}></Column>
                    </DataTable>
                </div>

                <Dialog visible={this.state.employeeDialog} style={{ width: '450px' }} header="Employee Details" modal className="p-fluid" footer={employeeDialogFooter} onHide={this.hideDialog}>
                    <div className="p-field">
                        <label htmlFor="name">Name</label>
                        <InputText id="name" value={this.state.employee.name} onChange={(e) => this.onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': this.state.submitted && !this.state.employee.name })} />
                        {this.state.submitted && !this.state.employee.name && <small className="p-error">Name is required.</small>}
                    </div>

                    <div className="p-formgrid p-grid">
                        <div className="p-field p-col">
                            <label htmlFor="salary">Salary</label>
                            <InputNumber id="salary" value={this.state.employee.salary} onValueChange={(e) => this.onInputNumberChange(e, 'salary')} mode="currency" currency="INR" locale="en-IN" />
                        </div>
                        <div className="p-field p-col">
                            <label htmlFor="age">Age</label>
                            <InputNumber id="age" value={this.state.employee.age} onValueChange={(e) => this.onInputNumberChange(e, 'age')} integeronly />
                        </div>
                    </div>
                    <div className="p-field">
                        <label htmlFor="name">Address</label>
                        <InputTextarea id="name" value={this.state.employee.address} onChange={(e) => this.onInputChange(e, 'address')} required autoFocus className={classNames({ 'p-invalid': this.state.submitted && !this.state.employee.address })} />
                        {this.state.submitted && !this.state.employee.name && <small className="p-error">Address is required.</small>}
                    </div>
                </Dialog>

                <Dialog visible={this.state.deleteEmployeeDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteEmployeeDialogFooter} onHide={this.hideDeleteEmployeeDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                        {this.state.employee && <span>Are you sure you want to delete <b>{this.state.employee.name}</b>?</span>}
                    </div>
                </Dialog>

                <Dialog visible={this.state.deleteEmployeesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteEmployeesDialogFooter} onHide={this.hideDeleteEmployeesDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                        {this.state.employee && <span>Are you sure you want to delete the selected employees?</span>}
                    </div>
                </Dialog>
            </div>
        );
    }
}

export default EmployeeList;