
import React, {useEffect, useState} from "react";
import axiosInstance from "axios";
import './Table.css'
import {Button, TextField} from "@mui/material";
import Modal from "react-modal";
import ChatWindow from "./ChatWindow";

Modal.setAppElement("#root"); // Set the root element as the app element
const TableBody = ({item}) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const [modalChatIsOpen, setModalChatIsOpen] = useState(() => {
        const storedValue = localStorage.getItem('modalChatClientIsOpen');
        const storedId = localStorage.getItem("chatOpenedWithClientId")
        if(storedId === item.id)
            return storedValue
        return false
    });

    const openModal = () => {setModalIsOpen(true);};
    const closeModal = () => {setModalIsOpen(false);};

    const isAdmin = localStorage.getItem('isAdmin')
    const idAdmin = localStorage.getItem('id')

    const openModalChatClient = () => {
        setModalChatIsOpen(true);
        localStorage.setItem("chatOpenedWithClientId", item.id)
        localStorage.setItem("messageSentByAdminOrClient", "admin")
        axiosInstance.get(`http://localhost:8083/sendSeenMessage/${idAdmin}/admin/${item.id}/Seen`)
    };

    const closeModalChatClient = () => {
        setModalChatIsOpen(false);
        localStorage.setItem("modalChatClientIsOpen", false)
        localStorage.setItem("chatOpenedWithClientId", "")
          };

    let editClientData = {
        id: item.id,
        username: item.username,
        password: item.password,
        age: item.age,
        role: 0}
    const handleInput = (event) => {
        const {value, name} = event.target;
        if(name === 'username') editClientData.username = value
        if(name === 'password') editClientData.password = value
        if(name === 'age') editClientData.age = value
        console.log(value);
    };
    function editClient(){
        if(isAdmin === "true")
            axiosInstance.post("http://localhost:8081/secure/admin/editClient/", editClientData)
                .then(res => {alert("Account modified!");})
                .catch(error => {alert("Username already exists!")})
    }
    function deleteClient(){
        if(isAdmin === "true")
            axiosInstance.delete("http://localhost:8081/secure/admin/deleteClient/" + idAdmin + "/" + item.id)
                .then( res => {
                    if(item.role === "CLIENT")
                        axiosInstance.delete("http://localhost:8080/secure/person/deleteClient/" + (item.id).toString())
                    window.location.replace("http://localhost:3003/admin/home");})
    }

return (
        <tr>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Example Modal"
            >
                <p style={{ display: 'flex', justifyContent: 'center' }}>
                    <form >
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
                            onClick={editClient}
                            style={{ backgroundColor: 'gray', color: 'white',  display: 'flex', justifyContent: 'center' }}>
                            Save
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            size="small"
                            onClick={closeModal}
                            style={{ backgroundColor: 'gray', color: 'white',  display: 'flex', justifyContent: 'center' }}>
                            Cancel
                        </Button>
                    </form>
                </p>
            </Modal>

            <Modal
                isOpen={modalChatIsOpen}
                onRequestClose={closeModalChatClient}
                contentLabel="Chat Modal"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)' // Overlay background color
                    },
                    content: {
                        maxWidth: '600px',
                        margin: 'auto',
                        padding: '20px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#f9f9f9',
                        borderRadius: '10px',
                        backgroundImage: 'url("your-background-image-url.jpg")', // Add your background image URL here
                        backgroundSize: 'cover', // Adjust according to your needs
                        backgroundRepeat: 'no-repeat', // Adjust according to your needs
                        backgroundPosition: 'center', // Adjust according to your needs
                    }
                }}>
                <p>
                    <ChatWindow user={item} />
                    <Button
                        type="submit"
                        variant="contained"
                        size="small"
                        onClick={closeModalChatClient}
                        style={{ backgroundColor: 'gray', color: 'white',  display: 'flex', justifyContent: 'center' }}>
                        Cancel
                    </Button>
                </p>
            </Modal>

            <td>{item.id}</td>
            <td>{item.username}</td>
            <td>{item.password}</td>
            <td>{item.age}</td>
            <td>{item.role}</td>
            <td><Button  type="submit"
                         fullWidth
                         variant="contained"
                         size="small"
                         onClick={openModal}
                         style={{ backgroundColor: 'gray', color: 'white' }}> Edit</Button></td>
            <td><Button  type="submit"
                         onClick={deleteClient}
                         fullWidth
                         variant="contained"
                         size="small"
                         style={{ backgroundColor: 'gray', color: 'white' }}> Delete</Button></td>
            <td><Button  type="submit"
                         onClick={openModalChatClient}
                         fullWidth
                         variant="contained"
                         size="small"
                         style={{ backgroundColor: 'gray', color: 'white' }}> Chat</Button></td>
        </tr>

    );
}
export default TableBody;