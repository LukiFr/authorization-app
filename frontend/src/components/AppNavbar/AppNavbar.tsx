import React, { useState, useEffect } from "react"
import { Navbar, Nav, Container } from "react-bootstrap"
import jwt_decode from "jwt-decode"

const AppNavbar: React.FC = () => {
    const [token, setToken] = useState("")

    let decoded = null

    if (token) {
        decoded = jwt_decode(token)
    }

    useEffect(() => setToken(localStorage.getItem("token")), [])

    const handleLogout = () => {
        localStorage.removeItem("token")
        window.location.href = "/login"
    }

    return (
        <Navbar bg="primary" variant="dark">
            <Container>
                <Navbar.Brand>
                    {decoded ? decoded.userName : "Welcome in my APP :)"}
                </Navbar.Brand>
                <Nav className="">
                    {token && (
                        <Nav.Link onClick={() => handleLogout()}>
                            Logout
                        </Nav.Link>
                    )}
                </Nav>
            </Container>
        </Navbar>
    )
}

export default AppNavbar
