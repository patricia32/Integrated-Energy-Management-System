import NavigationBar from "./commons/components/navigation-bar"
import React, {useEffect, useState} from "react";
import axiosInstance from "axios";
import TableHead from './commons/components/Table-head'
import {Button, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import TableHeadDevices from "./commons/components/TableHeadDevices";
import * as SockJS from "sockjs-client";
import * as Stomp from "stompjs";
class AdminHome extends React.Component {

    constructor() {
        super();
        localStorage.setItem("chatOpenedWithClientId", "");
        this.state = {
        }
        this.users= []
        this.getUsers()

        this.clients = []

        this.selectedClient ={
            id: "",
            username: ""}

        this.clientData = {
            username: "",
            password: "",
            age: 0,
            role: ""}

        this.deviceData = {
            description: "",
            address: "",
            max_consumption: 0,
            person: ""}

        this.isAdmin = localStorage.getItem('isAdmin')
        this.idAdmin = localStorage.getItem("idAdmin")

        localStorage.setItem('modalChatIsOpenForAdmin', "false");

    }

    modalChatClientIsOpen = localStorage.getItem("modalChatClientIsOpen")
    chatOpenedWithClientId = localStorage.getItem("chatOpenedWithClientId")
    async componentDidMount() {
        console.log("In Connect");

        if (this.stompClient && this.stompClient.connected)
            return;

        const URL = "http://localhost:8083/socketChat";
        const websocket = new SockJS(URL);
        this.stompClient = Stomp.over(websocket);

        await this.stompClient.connect({}, async frame => {
            if (!this.subscription) {
                this.subscription = this.stompClient.subscribe("/topic/socketChat/" + this.idAdmin, notification => {
                    axiosInstance.get("http://localhost:8083/getAdminChats/" + this.idAdmin)
                        .then(response => {
                            localStorage.setItem("chats", JSON.stringify(response.data));
                            const message = JSON.parse(notification.body);

                            localStorage.setItem("messageReceivedFromAdmin", JSON.stringify(message))
                            localStorage.setItem("openChat", true)

                            let chatOpenedWithClientId = localStorage.getItem("chatOpenedWithClientId")

                            if(chatOpenedWithClientId === message.idSender || chatOpenedWithClientId === message.senderId ){
                                if( message.content === "Typing..."){
                                    console.log(message.content)
                                    localStorage.setItem("seenOrTyping", message.content)
                                    localStorage.setItem("seenForClientPage", true)
                                    this.forceUpdate()
                                }
                                else{
                                    localStorage.setItem("messageContent", message.content)
                                    localStorage.setItem("seenForClientPage", "")
                                }
                            }
                            else
                                if(message.content !== "Seen" && message.content !== "Typing...") {
                                    const popupText = `${message.senderUsername} says: ${message.content}`;
                                    alert(popupText)
                                    this.forceUpdate()
                                }
                            this.forceUpdate()
                        });
                });
            }
        });
    }


    openModalChatClient = (senderId, senderUsername) => {
        localStorage.setItem('modalChatIsOpenForAdmin', true);
        localStorage.setItem("chatOpenedWithClientId", senderId);
        localStorage.setItem("modalChatClientIsOpen", true)
        this.forceUpdate()
    };

    closeModalChatClient = () => {
        localStorage.setItem('modalChatIsOpenForAdmin', false);
        localStorage.setItem("chatOpenedWithClientId", "");
        localStorage.setItem("modalChatClientIsOpen", false)
    };

    getUsers = event => {
        axiosInstance.get("http://localhost:8081/secure/person/getAllUsers")
            .then(response => {this.users = response.data;console.log(response.data)})
            .catch(error => {})
    }

    handleInput = event => {
        const {value, name} = event.target;
        this.setState({
            [name]: value});

        if(name === "person")
            this.deviceData.person=value

        if(name === "selectedClient"){
            if(value === "" || value === "NONE" || value === "None" || value === "-1"){
                localStorage.setItem("selectedClientId", "")
                localStorage.setItem("selectedClientUsername", "")
                this.selectedClient.username = ""
            }
            else{
                this.selectedClient.username = value
                localStorage.setItem("selectedClientId", this.selectedClient)
                localStorage.setItem("selectedClientUsername", this.selectedClient.username)
                console.log(this.selectedClient)
            }
        }
    };
    onSubmitFun = event => {
        event.preventDefault();
         this.clientData = {
             username: this.state.username,
             password: this.state.password,
             age: this.state.age,
             role: this.state.role}

        axiosInstance.post("http://localhost:8081/secure/admin/addClient", this.clientData)
            .then(res => {
                    if(res.data.role === "CLIENT")
                        axiosInstance.post("http://localhost:8080/secure/person/addClient", res.data.id)
                    alert("Client added!");
                    window.location.replace("http://localhost:3003/admin/home")
                })
            .catch(error => {alert("Username already exists!")})
    }

    onSubmitFunDevice = event => {
            event.preventDefault();
            this.deviceData = {
                description: this.state.description,
                address: this.state.address,
                max_consumption: this.state.max_consumption,
                person: this.state.person
            }
            axiosInstance.post("http://localhost:8080/secure/device/addDevice", this.deviceData)
                .then(res => {
                        alert("Device added!");
                        window.location.replace("http://localhost:3003/admin/home")
                })
        }


    render() {
        if(this.isAdmin ==="true") {
            return (
                <div>
                    <header>
                        <NavigationBar/>
                    </header>
                    People
                    <TableHead/>
                    <p style={{display: 'flex', justifyContent: 'center'}}>
                        <form onSubmit={this.onSubmitFun}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="string"
                                onChange={this.handleInput}
                                autoFocus
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={this.handleInput}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="age"
                                label="Age"
                                name="age"
                                type="number"
                                autoComplete="string"
                                onChange={this.handleInput}
                                autoFocus
                            />
                            <Select
                                value={this.deviceData.person || ''} // Set the selected value
                                name="role"
                                onChange={this.handleInput}
                            >
                                <MenuItem value={"0"}>CLIENT</MenuItem>
                                <MenuItem value={"1"}>ADMIN</MenuItem>

                            </Select>
                            <Button
                                type="submit"
                                variant="contained"
                                size="small"
                                style={{
                                    backgroundColor: 'gray',
                                    color: 'white',
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>
                                Add user
                            </Button>
                        </form>
                    </p>
                    <p>
                        Devices
                        <TableHeadDevices/>
                        <p style={{display: 'flex', justifyContent: 'center'}}>
                            <form onSubmit={this.onSubmitFunDevice}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="description"
                                    label="Description"
                                    name="description"
                                    autoComplete="string"
                                    onChange={this.handleInput}
                                    autoFocus
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="address"
                                    label="Address"
                                    id="address"
                                    onChange={this.handleInput}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="max_consumption"
                                    type="number"
                                    label="Maximum hourly energy consumption"
                                    name="max_consumption"
                                    autoComplete="string"
                                    onChange={this.handleInput}
                                    autoFocus
                                />
                                <Select
                                    value={this.deviceData.person || ''} // Set the selected value
                                    name="person"
                                    onChange={this.handleInput}
                                    inputProps={{id: 'user'}}
                                >
                                    <MenuItem value="">None</MenuItem>
                                    {this.users.map((option) => {
                                        if (option.role === 'CLIENT') {
                                            return (<MenuItem key={option.username} value={option}>{option.username}</MenuItem>);
                                        }
                                        return null;
                                    })}
                                </Select>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="small"
                                    style={{
                                        backgroundColor: 'gray',
                                        color: 'white',
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}>
                                    Add device
                                </Button>
                            </form>
                        </p>

                    </p>
                  
                </div>
            );
        }
        else{
            return (
                <div>You are not an admin.</div>
            );
        }
    }
}
export default AdminHome;