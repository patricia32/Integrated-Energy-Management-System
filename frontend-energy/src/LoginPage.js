import React from "react";
import axiosInstance from 'axios';
import {Button, Container, Grid, TextField} from "@mui/material";

class LoginPage extends React.Component {
    constructor() {
        super();
        this.state = {
            username: "",
            password: "",
        };
    }

    handleInput = event => {
        const {value, name} = event.target;
        this.setState({
            [name]: value
        });
        console.log(value);
    };

    goToRegister = event => {
        window.location.replace("http://localhost:3003/public/register");
    }
    onSubmitFun = event => {
        event.preventDefault();
        let credentials = {
            username: this.state.username,
            password: this.state.password,
        }
        axiosInstance.post("http://localhost:8081/secure/authenticate", credentials)
            .then(
                res => {
                    const val = res.data;
                    console.log(val.role)
                    if (val.role === 'CLIENT') {
                        window.location.replace("http://localhost:3003/client/home");
                        localStorage.setItem('isAdmin', 'false');
                        localStorage.setItem('idClient', val.id)
                        localStorage.setItem('usernameClient', val.username)
                        console.log(val.id)
                    }
                    else {
                        window.location.replace("http://localhost:3003/admin/home")
                        localStorage.setItem('isAdmin', 'true')
                        localStorage.setItem('idAdmin', val.id)
                        localStorage.setItem('selectedAdminId', val.id);
                        localStorage.setItem("chats", JSON.stringify([]));
                    }
                    localStorage.setItem('id', val.id)
                })
            .catch(error => {alert("Invalid credentials!")})
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
                            <p>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                >
                                    Sign In
                                </Button>
                            </p>
                        </form>
                            <p>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    onClick={this.goToRegister}
                                >
                                    Register
                                </Button>
                            </p>


                    </Grid>
            </Container>
        );
    }
}
export default LoginPage;