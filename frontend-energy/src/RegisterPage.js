import React from "react";
import axiosInstance from 'axios';
import {Button, Container, Grid, TextField} from "@mui/material";

class RegisterPage extends React.Component {
    constructor() {
        super();
        this.state = {
            username: "",
            password: "",
            age: 0,
        };
    }

    handleInput = event => {
        const {value, name} = event.target;
        this.setState({
            [name]: value
        });
        console.log(value);
    };

    onSubmitFun = event => {
        event.preventDefault();
        let clientData = {
            username: this.state.username,
            password: this.state.password,
            age: this.state.age,
        }
        console.log(clientData)
        axiosInstance.post("http://localhost:8081/secure/register", clientData)
            .then(
                res => {
                    const val = res.data;
                    console.log(val)
                    axiosInstance.post("http://localhost:8080/secure/person/addClient", res.data.id)
                    window.location.replace("http://localhost:3003/client/home");
                    localStorage.setItem('isAdmin', 'false')
                    localStorage.setItem('id', val.id)
                    localStorage.setItem('idClient', val.id)
                    localStorage.setItem('usernameClient', val.username)
                })
            .catch(error => {
                console.log("Catch");
                alert("Username already exists!")
                console.log(error)
            })
    }

    render() {
        return (
            <Container maxWidth="sm">
                <Grid>
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
                        <p>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                            >
                                Create a new account
                            </Button>
                        </p>
                    </form>
                </Grid>
            </Container>
        );
    }
}
export default RegisterPage;