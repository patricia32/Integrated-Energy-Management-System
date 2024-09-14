import React from 'react'
import logo from '../images/icon.png';

import {
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Nav,
    Navbar,
    NavbarBrand,
    NavLink,
    UncontrolledDropdown
} from 'reactstrap';
import {Button} from "@mui/material";
import axiosInstance from "axios";

const textStyle = {
    color: 'white',
    textDecoration: 'none'
};

function logout() {
    localStorage.setItem('isAdmin', '')
    localStorage.setItem('id', '')
    window.location.replace("http://localhost:3003/public/login");
}

const NavigationBar = () => (
    <div>
        <Navbar color="dark" light expand="md">
            <NavbarBrand href="/">
                <img src={logo} width={"50"}
                     height={"35"} />
            </NavbarBrand>
            <Button
                type="submit"
                variant="contained"
                size="small"
                onClick={logout}
                style={{
                    backgroundColor: 'gray', color: 'white', display: 'flex', justifyContent: 'center'
                }}>
                Log out
            </Button>
        </Navbar>
    </div>
);

export default NavigationBar
