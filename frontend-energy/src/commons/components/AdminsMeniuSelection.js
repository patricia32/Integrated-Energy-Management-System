import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

class AdminsMeniuSelection extends React.Component {
    constructor() {
        super();
        this.state = {
            selectedAdmin: {
                id: "",
                username: ""
            },
            users: [] // You need to initialize the users array
        };
    }

    handleInput = (event) => {
        const { value } = event.target;
        this.setState({
            selectedAdmin: { adminId: value.id, adminUsername: value.username }
        });

        localStorage.setItem("selectedAdmin", JSON.stringify(this.state.selectedAdmin));
        console.log(this.state.selectedAdmin);
    };

    render() {
        return (
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
                        if (option.role === 'ADMIN') {
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

export default AdminsMeniuSelection;
