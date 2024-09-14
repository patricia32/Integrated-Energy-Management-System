import React, {useEffect, useState} from "react";
import axiosInstance from "axios";
import './Table.css';
import TableBodyDevices from "./TableBodyDevices";

const TableHeadDevices = () => {
    const [devices, setDevices] = useState([]);
    const isAdmin = localStorage.getItem('isAdmin')
    const idUser = localStorage.getItem('id')
    let noElements = false;

    useEffect(() => {
        if(isAdmin === "true"){
            axiosInstance.get("http://localhost:8080/secure/device/getAllDevices")
                .then(response => {setDevices(response.data)})
                .catch(error => {noElements = true;})
        }
        else{
            axiosInstance.get("http://localhost:8080/secure/person/getUserDevices/" + idUser  )
                .then(response => {setDevices(response.data)})
                .catch(error => {noElements = true;})
        }
    }, [])

    return (
        <div>
            {noElements === false ? ( // Check if there are elements in the clients array
                <table className="styled-table">
                    <thead>
                        {isAdmin === "true" ? (
                            <tr>
                                <th>ID</th>
                                <th>Description</th>
                                <th>Address</th>
                                <th>Max consumption</th>
                                <th>User</th>
                                <th>Edit device</th>
                                <th>Delete device</th>
                            </tr>
                            ) : (
                                <tr>
                                    <th>Description</th>
                                    <th>Address</th>
                                    <th>Max consumption</th>
                                    <th>Delete device</th>
                                </tr>
                            )}
                    </thead>
                    <tbody>
                    {devices.map((device) => (
                        <TableBodyDevices key={device.id} item={device}/>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No clients found.</p>
            )}
        </div>
    );

}
export default TableHeadDevices;