import React, {useEffect, useState} from "react";
import Modal from "react-modal";
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import TableHeadDevices from "./commons/components/TableHeadDevices";
import NavigationBar from "./commons/components/navigation-bar";
import "./commons/components/calendar"
import Calendar from "./commons/components/calendar";

import CanvasJSReact from '@canvasjs/react-charts';
import ChatWindow from "./commons/components/ChatWindow";
import {Button, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import axiosInstance from "axios";
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

Modal.setAppElement("#root"); // Set the root element as the app element

class ClientHome extends React.Component {
    constructor() {
        super()
        this.state = {
            devices: [],
            users: [],
            selectedAdmin: {
                id: "",
                username: "",
                password: "",
                age: 0
            },
            message: null,
            selectedDate: new Date(),
            modalChatClientIsOpen: false
        }

        this.isAdmin = localStorage.getItem('isAdmin')
        this.idClient = localStorage.getItem('idClient')

        this.stompClient = null

        this.usernameClient = localStorage.getItem('usernameClient')
        this.users = []

        this.chartData = {
            hours: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
            energyValues: [10, 25, 13, 32, 20, 18, 30, 28, 22, 15, 28, 35, 40, 36, 45, 50, 48, 42, 38, 30, 20, 15, 10, 5],
        };
        this.connect()
    };

    connect() {
        console.log("In Connect");
        const URL = "http://localhost:8082/socket";
        const websocket = new SockJS(URL);
        this.stompClient = Stomp.over(websocket);
        this.stompClient.connect({}, frame => {
            this.stompClient.subscribe("/topic/socket/" + this.idClient, notification => {
                let message = notification.body;
                alert(message)
            })
        })
    }

    async componentDidMount() {
        const response = await axiosInstance.get("http://localhost:8081/secure/person/getAllUsers");
            const users = response.data;
            this.setState({ users });

        console.log("In Connect");

        if (this.stompClient && this.stompClient.connected)
            return;

        const URL = "http://localhost:8083/socketChat";
        const websocket = new SockJS(URL);
        this.stompClient = Stomp.over(websocket);

        await this.stompClient.connect({}, async frame => {
           if (!this.subscription) {
                this.subscription = this.stompClient.subscribe("/topic/socketChat/" + this.idClient, notification => {
                    const message = JSON.parse(notification.body);
                    if( message.content === "Typing..."){
                        localStorage.setItem("seenOrTyping", message.content)
                        localStorage.setItem("seenForClientPage", true)
                        this.forceUpdate()
                    }
                    else{
                        const popupText = `${message.senderUsername} says: ${message.content}`;
                        if(this.state.modalChatClientIsOpen !== true){
                            const userResponse = window.confirm(popupText + "\n\nOpen Message?");
                            if (userResponse)
                                this.openModalChatClient(message.senderId, message.senderUsername)
                            else
                                this.closeModalChatClient()
                            this.forceUpdate()
                        }
                        else
                            localStorage.setItem("messageContent", message.content)

                    }
                    this.forceUpdate()

                });
            }
        });
    }

    handleInput = event => {
        const {value, name} = event.target;
        this.state.selectedAdmin = value
      
        if(value.username !== "None" && value.username !== undefined)
            this.openModalChatClient(this.state.selectedAdmin.id, this.state.selectedAdmin.username)};

    openModalChatClient = (senderId, senderUsername) => {

      
        localStorage.setItem("messageSentById", senderId)
        localStorage.setItem("messageSentByUsername", senderUsername)
        localStorage.setItem("messageSentByAdminOrClient", "client")
        localStorage.setItem("chatClientOpened", "true")



        if(senderId !== "" && senderId !== undefined)
            this.setState({
                modalChatClientIsOpen: true,
                selectedAdmin: { id: senderId, username: senderUsername }});
        localStorage.setItem("selectedAdmiUsername", this.state.selectedAdmin.username)

     
    };

    closeModalChatClient = () => {
        localStorage.setItem("selectedAdmiUsername", "")
        this.setState({
            modalChatClientIsOpen: false,
            selectedAdmin: { id: "", username: "" }
        });

    };
    render() {
        if (this.isAdmin === "false") {
            return (
                <div>
                    <NavigationBar/>
                    <h1>Hello {this.usernameClient}</h1>
                    <TableHeadDevices/>
                    <Calendar />
                    <FormControl>
                        <InputLabel id="live-chat-label">Live chat. Select an admin</InputLabel>
                        <Select
                            labelId="live-chat-label"
                            name="selectedAdmin"
                            onChange={this.handleInput}
                            style={{ width: '300px', height: '40px' }}
                        >
                            <MenuItem value={""}>NONE</MenuItem>
                            {this.state.users.map((option) => {
                                if (option.role === 'ADMIN')
                                    return (
                                        <MenuItem key={option.username} value={option}> {option.username}</MenuItem>
                                    );
                                return null;
                            })}
                        </Select>
                    </FormControl>

                    <Modal
                        isOpen={this.state.modalChatClientIsOpen}
                        onRequestClose={this.closeModalChatClient}
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
                            <ChatWindow user={this.state.selectedAdmin} />
                            <Button
                                type="submit"
                                variant="contained"
                                size="small"
                                onClick={this.closeModalChatClient}
                                style={{ backgroundColor: '#999999', color: 'white',  display: 'flex', justifyContent: 'center' }}>
                                Cancel
                            </Button>
                        </p>
                    </Modal>
                </div>
            );
        }
        else return (<div>You are not a client.</div>);
    }
}
export default ClientHome;



