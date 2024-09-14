import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

class ClientMenuSelection extends React.Component {
    constructor() {
        super();
        this.state = {
            selectedClient: {
                id: "",
                username: ""
            },
            users: [] // You need to initialize the users array
        };
    }

    handleInput = (event) => {
        const { value } = event.target;
        this.setState({
            selectedClient: { ClientId: value.id, ClientUsername: value.username }
        });

        localStorage.setItem("selectedClient", JSON.stringify(this.state.selectedClient));
        console.log(this.state.selectedClient);
    };

    render() {
        return (
            <FormControl>
                <InputLabel id="live-chat-label">Live chat. Select an Client</InputLabel>
                <Select
                    labelId="live-chat-label"
                    name="selectedClient"
                    onChange={this.handleInput}
                    style={{ width: '300px', height: '40px' }}
                >
                    <MenuItem value={""}>NONE</MenuItem>
                    {this.state.users.map((option) => {
                        if (option.role === 'CLIENT') {
                            return (
                                <MenuItem key={option.username} value={option}>
                                    {option.username}
                                </MenuItem>
                            );
                        }
                        return null;
                    })}
                </Select>
            </FormControl>
        );
    }
}

export default ClientMenuSelection;
