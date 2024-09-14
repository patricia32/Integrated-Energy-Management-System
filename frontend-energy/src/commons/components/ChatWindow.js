import React, { Component } from 'react';
import axiosInstance from 'axios';
import { id } from 'date-fns/locale';

class ChatWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            newMessage: '',
            lastMessage: '',
            seenForClientPage: localStorage.getItem("seenForClientPage")
        };
    }

    seenOrTyping = localStorage.getItem("seenOrTyping")
    componentDidMount() {
        this.fetchMessages();
    }
    componentDidUpdate(prevProps) {

        const chatWindow = document.getElementById('chatWindow'); // Adjust the ID if needed
        if (chatWindow)
            chatWindow.scrollTop = chatWindow.scrollHeight;


        const recentMessage = localStorage.getItem("messageContent")
        if (this.state.lastMessage !== recentMessage) {
            this.fetchMessages();
            this.setState({
                lastMessage: localStorage.getItem("messageContent"),
            })
        }
        if(localStorage.getItem("seenForClientPage") !== this.state.seenForClientPage){
            this.setState({
                seenForClientPage: localStorage.getItem("seenForClientPage")
            })
            this.forceUpdate()
        }
    }

    messageSentByAdminOrClient = localStorage.getItem('messageSentByAdminOrClient');
    idSelectedAdmin = localStorage.getItem('selectedAdminId');
    fetchMessages() {
        let messageSentById = localStorage.getItem('messageSentById');
        let messageSentByUsername = localStorage.getItem('messageSentByUsername');
        let messageSentByAdminOrClient = localStorage.getItem('messageSentByAdminOrClient');

        let idAdmin = localStorage.getItem('idAdmin');
        let idClient = localStorage.getItem('idClient');
        let idSelectedAdmin = localStorage.getItem('selectedAdminId');

        if (messageSentByAdminOrClient === 'admin') {
            axiosInstance
                .get(`http://localhost:8083/getAdminChatMessages/${idAdmin}/${this.props.user.id}`)
                .then((response) => {
                    const fetchedMessages = [];
                    response.data.map((message, index) => {
                        if (message.messageSentByClient === true)
                            fetchedMessages.push({
                                content: message.content,
                                sender: 'received',
                            });
                        else
                            fetchedMessages.push({
                                content: message.content,
                                sender: 'sent',
                            });
                    });
                    console.log('sent by admin');
                    this.setState((prevState) => ({
                        messages: [...prevState.messages, ...fetchedMessages],
                    }));
                });
    }
    else
        if (idSelectedAdmin !== '' && idSelectedAdmin !== 'undefined') {
        axiosInstance
            .get(`http://localhost:8083/getAdminChatMessages/${idSelectedAdmin}/${idClient}`)
            .then((response) => {
                const fetchedMessages = [];
                response.data.map((message, index) => {
                    message.seen = true
                    if (message.messageSentByClient === false)
                        fetchedMessages.push({
                            content: message.content,
                            sender: 'received',});
                    else
                        fetchedMessages.push({
                            content: message.content,
                            sender: 'sent',});
                });
                 localStorage.setItem("seenForClientPage", false)
                this.setState((prevState) => ({
                    messages: [...prevState.messages, ...fetchedMessages],
                    seenForClientPage: false
                }));
            });
   }
    }

    handleSendMessage = () => {

        const { newMessage } = this.state;

        if (newMessage.trim() === '') return;

        this.setState((prevState) => ({
            messages: [...prevState.messages, { content: newMessage, sender: 'sent' }],
            newMessage: '',
        }));

        let messageSentById = localStorage.getItem('messageSentById');
        let messageSentByUsername = localStorage.getItem('messageSentByUsername');
        let messageSentByAdminOrClient = localStorage.getItem('messageSentByAdminOrClient');
        let idAdmin = localStorage.getItem('idAdmin');
        let idClient = localStorage.getItem("idClient")
        let usernameClient = localStorage.getItem("usernameClient")
        let idSelectedAdmin = localStorage.getItem('selectedAdminId');

        if (messageSentByAdminOrClient === 'client'){
            console.log("sent by client?")
            let idAdmin = localStorage.getItem('selectedAdminId');
            console.log(" id client = " + this.props.user.id)
            console.log(" id admin = " + idAdmin)
            if(this.props.user.id === idAdmin){
                 axiosInstance.get(`http://localhost:8083/sendMessageToAdmin/${idAdmin}/${idClient}/${usernameClient}/${newMessage}`);
            }
           else{
                axiosInstance.get(`http://localhost:8083/sendMessageToAdmin/${idAdmin}/${this.props.user.id}/${usernameClient}/${newMessage}`);
            }
        }
        else {
            let idAdmin = localStorage.getItem('idAdmin');
            axiosInstance.get(`http://localhost:8083/sendMessageToClient/${idAdmin}/${this.props.user.id}/admin/${newMessage}`);
        }
    };

    sendSeen(){
        if(this.messageSentByAdminOrClient === "admin"){
            let idAdmin = localStorage.getItem('idAdmin');
            axiosInstance.get(`http://localhost:8083/sendSeenMessage/${idAdmin}/admin/${this.props.user.id}/Typing...`);
        }
        else{
            console.log("tyyyyyping here")
            let idAdmin = localStorage.getItem('selectedAdminId');
            if(this.props.user.id === idAdmin){
                let idClient = localStorage.getItem("idClient")
                let usernameClient = localStorage.getItem("usernameClient")
                axiosInstance.get(`http://localhost:8083/sendSeenMessage/${idClient}/${usernameClient}/${idAdmin}/Typing...`);
            }
            else
                axiosInstance.get(`http://localhost:8083/sendSeenMessage/${this.props.user.id}/${this.props.user.username}/${idAdmin}/Typing...`);
        }
        this.forceUpdate()
}


    render() {
        if(this.props.user.id === undefined){
            this.props.user.id = localStorage.getItem("selectedAdminId")
            this.props.user.username = localStorage.getItem("selectedAdmiUsername")
        }
        const { user } = this.props;
        const { messages, newMessage } = this.state;

        return (
            <div
                style={{
                    maxWidth: '600px',
                    margin: 'auto',
                    padding: '20px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '10px',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <h2 style={{ color: '#333', fontSize: '24px', fontWeight: 'bold' }}>{user.username}</h2>
                </div>
                <div
                    id="chatWindow"
                    style={{
                        maxHeight: '300px',
                        overflowY: 'scroll',
                        border: '1px solid #ddd',
                        padding: '10px',
                        marginBottom: '20px',
                        borderRadius: '8px',
                        backgroundColor: '#fff',
                    }}
                >
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            style={{
                                padding: '10px',
                                margin: '10px 0',
                                borderRadius: '8px',
                                backgroundColor: message.sender === 'sent' ? '#5cb85c' : '#999999',
                                color: '#fff',
                                textAlign: message.sender === 'sent' ? 'right' : 'left',
                                marginLeft: message.sender === 'received' ? '0' : 'auto',
                                marginRight: message.sender === 'sent' ? '0' : 'auto',
                                width: 'fit-content',
                            }}
                        >
                            {message.content}
                           </div>
                    ))}
                    {/* Render "Seen" if the condition is met */}
                    {this.state.seenForClientPage==="true" &&  <div style={{ textAlign: 'right', color: 'gray', fontStyle: 'italic' }}>{this.seenOrTyping}</div>}

                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => {
                            this.setState({newMessage: e.target.value});
                            this.sendSeen()
                        }}
                        style={{
                            flex: 1,
                            padding: '10px',
                            borderRadius: '4px',
                            marginRight: '10px',
                            border: '1px solid #ddd',
                            backgroundColor: '#fff',
                        }}
                        placeholder="Type your message..."
                    />
                    <button
                        onClick={this.handleSendMessage}
                        style={{
                            padding: '10px',
                            borderRadius: '4px',
                            backgroundColor: '#5cb85c',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s',
                        }}
                    >
                        Send
                    </button>
                </div>
            </div>
        );
    }
}

export default ChatWindow;
