import React from "react"
import { Form, Button, Container, Card } from "react-bootstrap"
import axios from "axios"

const RegisterForm: React.FC = () => {
    const handleRegisterFormSubmit = (e) => {
        axios
            .post("http://localhost:9000/register", {
                emailAdress: e.target[0].value,
                userName: e.target[1].value,
                password: e.target[2].value,
            })
            .then((r) => console.log(r))
            .then(() => (window.location.href = "/login"))
            .catch((e) => new Error(e))
        e.preventDefault()
    }

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Card className="text-center p-5 w-50">
                <Card.Title className="fs-1 mb-5">Register</Card.Title>
                <Form onSubmit={(e) => handleRegisterFormSubmit(e)}>
                    <Form.Group className="mb-4">
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Control
                            type="text"
                            placeholder="Username"
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
                </Form>
            </Card>
        </Container>
    )
}

export default RegisterForm
