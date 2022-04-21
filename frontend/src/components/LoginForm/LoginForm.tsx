import React from "react"
import { Form, Button, Container, Card } from "react-bootstrap"
import axios from "axios"

const LoginForm: React.FC = () => {
    const handleLogInFormSubmit = (e) => {
        axios
            .post("http://localhost:9000/login", {
                emailAdress: e.target[0].value,
                password: e.target[1].value,
            })
            .then((r) => localStorage.setItem("token", r.data.token))
            .then(() => (window.location.href = "/adminpanel"))
            .catch((e) => {
                window.alert("WRONG CREDENTIALS")
                new Error(e)
            })
        e.preventDefault()
    }

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Card className="text-center py-4 px-5 w-50">
                <Card.Title className="fs-1 mb-5">Log In</Card.Title>
                <Form onSubmit={(e) => handleLogInFormSubmit(e)}>
                    <Form.Group className="mb-4" controlId="formBasicEmail">
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="formBasicPassword">
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            required
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-50">
                        Submit
                    </Button>

                    <p className="mt-2">
                        Not a member? <a href="/register">Register</a>
                    </p>
                </Form>
            </Card>
        </Container>
    )
}

export default LoginForm
