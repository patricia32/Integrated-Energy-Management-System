import React, {useEffect, useState} from "react";
import axiosInstance from "axios";
import './Table.css'
import {Button, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import Modal from "react-modal";

Modal.setAppElement("#root"); // Set the root element as the app element
const TableBodyDevices = ({item}) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const closeModal = () => {
        setModalIsOpen(false);
    };
    const [modalIsOpenDevice, setModalIsOpenDevice] = useState(false);
    const openModalDevice = () => {
        setModalIsOpenDevice(true);
    };
    const closeModalDevice = () => {
        setModalIsOpenDevice(false);
    };

    const isAdmin = localStorage.getItem('isAdmin')
    const idAdmin = localStorage.getItem('id')
    const [chosenPerson, setChosenPerson] = useState(false);
    const [description, setDescription] = useState(item.description);
    const [address, setAddress] = useState(item.address);
    const [maxC, setMaxC] = useState(item.max_consumption);

    console.log(idAdmin)
    let editDeviceData = {
        id: item.id, description: item.description, address: item.address, max_consumption: item.max_consumption, person: item.person
    }
    const handleInput = (event) => {
        const {value, name} = event.target;
        if (name === 'description') {
            setDescription(value);
            editDeviceData.description = value
        }
        if (name === 'address') {
            setAddress(value)
            editDeviceData.address = value
        }
        if (name === 'max_consumption') {
            setMaxC(value);
            editDeviceData.max_consumption = value
        }
        if (name === 'person'){
            setChosenPerson(value);
            editDeviceData.person = value
        }
    };

    function editDevice() {

        editDeviceData.description = description;
        editDeviceData.address = address;
        editDeviceData.max_consumption = maxC;

        if(chosenPerson === false || chosenPerson === null || chosenPerson === "")
            editDeviceData.person = null;
        else
            editDeviceData.person = chosenPerson

        if (isAdmin === "true") axiosInstance.put("http://localhost:8080/secure/device/editDevice", editDeviceData)
            .then(res => {alert("Device modified!");})
            .catch(error => {alert("Error!")})
    }

    function getHourlyUsage() {
       localStorage.setItem("deviceIdHourlyUsage", item.id);
       localStorage.setItem("deviceDescriptionHourlyUsage", item.description);
       window.location.replace("http://localhost:3003/client/home")
    }

    const [clients, setClients] = useState([]);
    let noElements = false;
    useEffect(() => {
        axiosInstance.get("http://localhost:8081/secure/person/getAllClients")
            .then(response => {setClients(response.data);})
            .catch(error => {noElements = true;})
    }, [])

    return (<tr>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Example Modal"
            >
                <p style={{display: 'flex', justifyContent: 'center'}}>
                    <form>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            placeholder={item.username}
                            autoComplete="string"
                            onChange={handleInput}
                            autoFocus
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            onChange={handleInput}
                            autoComplete="current-password"
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="age"
                            label="Age"
                            name="age"
                            type="number"
                            placeholder={item.age}
                            onChange={handleInput}
                            autoComplete="string"
                            autoFocus
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            size="small"
                            onClick={editDevice}
                            style={{
                                backgroundColor: 'gray', color: 'white', display: 'flex', justifyContent: 'center'
                            }}>
                            Save
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            size="small"
                            onClick={closeModal}
                            style={{
                                backgroundColor: 'gray', color: 'white', display: 'flex', justifyContent: 'center'
                            }}>
                            Cancel
                        </Button>
                    </form>
                </p>
            </Modal>

            {isAdmin === "true" ? (
                <>
                    <td>{item.id}</td>
                    <td>{item.description}</td>
                    <td>{item.address}</td>
                    <td>{item.max_consumption}</td>
                    <td>{item.person === null ? 'N/A' : item.person.id} </td>
                    <td><Button type="submit"
                                fullWidth
                                variant="contained"
                                size="small"
                                onClick={openModalDevice}
                                style={{backgroundColor: 'gray', color: 'white'}}> Edit</Button></td>
                </>

            ) : (
                <>
                    <td>{item.description}</td>
                    <td>{item.address}</td>
                    <td>{item.max_consumption}</td>
                </>

            )}
            <td><Button type="submit"
                        onClick={getHourlyUsage}
                        fullWidth
                        variant="contained"
                        size="small"
                        style={{backgroundColor: 'gray', color: 'white'}}> Hourly usage</Button></td>
            <Modal
                isOpen={modalIsOpenDevice}
                onRequestClose={closeModalDevice}
            >
                <p style={{display: 'flex', justifyContent: 'center'}}>
                    <form>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="description"
                            label="Description"
                            name="description"
                            placeholder={item.description}
                            autoComplete="string"
                            onChange={handleInput}
                            autoFocus
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="address"
                            label="Address"
                            name="address"
                            placeholder={item.address}
                            autoComplete="string"
                            onChange={handleInput}
                            autoFocus
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="max_consumption"
                            label="Maximum hourly energy consumption"
                            name="max_consumption"
                            type="number"
                            placeholder={item.max_consumption}
                            onChange={handleInput}
                            autoComplete="string"
                            autoFocus
                        />
                        <InputLabel htmlFor="user">User</InputLabel>
                        <Select
                            value={item.person || ''} // Set the selected value
                            name="person"
                            onChange={handleInput}
                            inputProps={{ id: 'user' }}
                        >
                            <MenuItem value="">None</MenuItem>
                            {clients.map((option) => (
                                <MenuItem key={option.username} value={option}>
                                    {option.username}
                                </MenuItem>
                            ))}
                        </Select>
                        <div>You selected the person with id: {chosenPerson.id}</div>
                        <div> username: {chosenPerson.username}</div>
                        <div> age: {chosenPerson.age}</div>
                        <Button
                            type="submit"
                            variant="contained"
                            size="small"
                            onClick={editDevice}
                            style={{
                                backgroundColor: 'gray', color: 'white', display: 'flex', justifyContent: 'center'
                            }}>
                            Save
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            size="small"
                            onClick={closeModalDevice}
                            style={{
                                backgroundColor: 'gray', color: 'white', display: 'flex', justifyContent: 'center'
                            }}>
                            Cancel
                        </Button>
                    </form>

                </p>
            </Modal>
        </tr>

    );
}
export default TableBodyDevices;