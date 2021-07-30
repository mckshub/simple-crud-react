import api from "../api/api";
import axios from "axios";
import baseURL from "../api/api";

const apiHeader = {
    headers: {
        
        "Content-Type": "application/json"
    }
};

export default class EmployeeService {

    
    getEmployees() {
        console.log(api);
        return axios.get(baseURL+"employees", apiHeader).then((res) => {
            console.log(res.data);
            return res.data;
        })
    }

    postEmployees(obj) {
        console.log(obj);
        return axios.post(baseURL+"employees", obj, apiHeader).then((res) => {
            console.log(res.data);    
            return res.data
        })
    }

    updateEmployees(id,obj) {
        console.log(id);
        return axios.put(baseURL+"employees"+'/'+id, obj, apiHeader).then((res) => {
            console.log(res.data);    
            return res.data;
        })
    }

    deleteEmployees(id) {
        console.log(id);
        return axios.delete(baseURL+"employees"+'/'+id, apiHeader).then((res) => {
            console.log(res.data);    
            return res.data;
        })
    }

}
