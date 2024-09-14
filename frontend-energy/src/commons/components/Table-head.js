
import NavigationBar from "./navigation-bar"
import React, {useEffect, useState} from "react";
import axiosInstance from "axios";
import './Table.css';
import TableBody from './Table-body'

const TableHead = () => {

    const [users, setUsers] = useState([]);
    let noElements = false;
    useEffect(() => {
            axiosInstance.get("http://localhost:8081/secure/person/getAllUsers")
                .then(response => {setUsers(response.data);})
                .catch(error => {noElements = true;})
    }, [])

        return (
            <div>
                {noElements === false? (
                    <table className="styled-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Password</th>
                            <th>Age</th>
                            <th>Role</th>
                            <th>Edit account</th>
                            <th>Delete account</th>
                            <th>Chat</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((client) => (
                            <TableBody key={client.id} item={client} />
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No users found.</p>
                )}
            </div>
        );

}
export default TableHead;