import React, { useState, useEffect, SetStateAction } from "react"
import { Table, Container, Button } from "react-bootstrap"
import axios from "axios"
import "bootstrap-icons/font/bootstrap-icons.css"

type User = {
    _id: number
    userName: string
    emailAdress: string
    lastLoginTime: string
    registrationTime: string
    isBlocked: boolean
    isChecked: boolean
}

const AdminPanel: React.FC = () => {
    const [users, setUsers] = useState<[User] | [] | SetStateAction<[User]>>([])
    const [allRowsSelected, setAllRowsSelected] = useState<boolean>(false)
    const [selectedUsersID, setselectedUsersID] = useState<
        [] | SetStateAction<[User] | ((prevState: [User]) => [User])>
    >([])

    const headers = {
        "x-access-token": localStorage.getItem("token"),
    }

    useEffect(() => {
        axios
            .get("http://localhost:9000/users", { headers })
            .then((r) =>
                setUsers(
                    r.data.users.map((x) => {
                        return {
                            _id: x._id,
                            userName: x.userName,
                            emailAdress: x.emailAdress,
                            lastLoginTime: x.lastLoginTime,
                            registrationTime: x.registrationTime,
                            isBlocked: x.isBlocked,
                            isChecked: false,
                        }
                    })
                )
            )
            .catch((e) => {
                new Error(e)

                if (e.response.status === 401) {
                    window.location.href = "/login"
                    localStorage.removeItem("token")
                }
            })
    }, [])

    useEffect(
        () => setselectedUsersID(users.map((x) => x.isChecked && x._id)),
        [users]
    )

    const handleSelectUser = (e, u) => {
        if (e.target.checked) {
            setUsers((currUsers) => {
                return currUsers.map((user) => {
                    if (user._id === u._id) {
                        return { ...user, isChecked: true }
                    }
                    return user
                })
            })
        } else {
            setAllRowsSelected(false)
            setUsers((currUsers) => {
                return currUsers.map((user) => {
                    if (user._id === u._id) {
                        return { ...user, isChecked: false }
                    }
                    return user
                })
            })
        }
    }

    const handleSelectAllRows = (e) => {
        if (allRowsSelected) {
            setAllRowsSelected(false)
        } else {
            setAllRowsSelected(true)
        }

        if (e.target.checked) {
            setUsers((currUsers) => {
                return currUsers.map((user) => {
                    return { ...user, isChecked: true }
                })
            })
        } else {
            setUsers((currUsers) => {
                return currUsers.map((user) => {
                    return { ...user, isChecked: false }
                })
            })
        }
    }

    const handleDeleteButton = () => {
        axios
            .delete("http://localhost:9000/users", {
                data: { headers, selectedUsersID },
            })
            .then(() => window.location.reload())
            .catch((e) => new Error(e))
    }

    const handleBlockButton = () => {
        console.log(selectedUsersID)
        axios
            .patch(
                "http://localhost:9000/users/block",
                { selectedUsersID },
                { headers }
            )
            .then(() => window.location.reload())
            .catch((e) => new Error(e))
    }

    const handleUnblockButton = () => {
        axios
            .patch(
                "http://localhost:9000/users/unblock",
                { selectedUsersID },
                { headers }
            )
            .then(() => window.location.reload())
            .catch((e) => new Error(e))
    }

    return (
        <>
            <Container className="mt-5 d-flex justify-content-center">
                <Button
                    variant="danger m-2"
                    onClick={() => handleBlockButton()}
                >
                    BLOCK
                </Button>
                <Button
                    className="bi bi-unlock m-2"
                    onClick={() => handleUnblockButton()}
                ></Button>
                <Button
                    className="bi bi-trash m-2"
                    onClick={() => handleDeleteButton()}
                ></Button>
            </Container>
            <Container className="d-flex justify-content-center mt-2">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    checked={allRowsSelected}
                                    onChange={(e) => handleSelectAllRows(e)}
                                />
                            </th>
                            <th>id</th>
                            <th>Name</th>
                            <th>Email Adress</th>
                            <th>Last Log In</th>
                            <th>Registration Time</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={user.isChecked}
                                        onChange={(e) =>
                                            handleSelectUser(e, user)
                                        }
                                    />
                                </td>
                                <td>{user._id}</td>
                                <td>{user.userName}</td>
                                <td>{user.emailAdress}</td>
                                <td>
                                    {user.lastLoginTime.split("T").join(" ")}
                                </td>
                                <td>
                                    {user.registrationTime.split("T").join(" ")}
                                </td>
                                <td>{user.isBlocked ? "BLOCKED" : "ACTIVE"}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </>
    )
}

export default AdminPanel
