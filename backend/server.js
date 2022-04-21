const app = require('express')();
const bodyParser = require('body-parser')
const cors = require("cors");
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require('./model/user.js');


const PORT = 9000;
const JWT_SECRET = "fdsaouu23o523509ik90advsaklm234"

const jsonParser = bodyParser.json();

const url =
    "mongodb+srv://lukifraniewski:Wwsi123@cluster0.aunvj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const dbName = "Cluster0";

async function main() {
    await mongoose.connect(url);
}

main()
    .then(
        app.listen(PORT, () => {
            console.log(`Node.js app is listening at http://localhost:${PORT}`);
        })
    )
    .catch(err => console.log(err));

app.use(cors())

app.post("/login", jsonParser, async (req, res) => {

    const { emailAdress, password } = req.body

    try {
        const user = await User.findOne({ emailAdress }).lean()
        const upd = await User.findOneAndUpdate({ user }, { lastLoginTime: new Date() })

        if (!user) {
            return res.json(401, { error: "Invalid password/ username" })
        }

        if (user.isBlocked) {
            return res.json(401, { error: "This account is blocked" })
        }

        if (await bcrypt.compare(password, user.passwordHash)) {
            const token = jwt.sign({ id: user._id, userName: user.userName }, JWT_SECRET)
            return res.json({ token: token })
        } else {
            return res.json(401, { error: "Invalid password" })
        }
    } catch (e) {
        console.log(e)
    }

})

app.post("/register", jsonParser, async (req, res) => {
    console.log(req.body)

    const { userName, password, emailAdress } = req.body

    const passwordHash = bcrypt.hashSync(password, 10);

    try {
        const response = await User.create({
            userName,
            passwordHash,
            emailAdress,
            registrationTime: new Date()
        })

        console.log(response);

    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }

    res.sendStatus(200);
});

app.get("/users", async (req, res) => {

    const token = req.headers["x-access-token"]

    try {
        const decoded = await jwt.verify(token, JWT_SECRET);

        const user = await User.findOne({ userName: decoded.userName }).lean()

        if (user.isBlocked) {
            return res.sendStatus(401);
        }

        if (decoded) {
            const users = await User.find({}, '_id userName emailAdress isBlocked registrationTime lastLoginTime')
            return res.json(200, { users: users })
        }

    } catch (e) {
        return res.sendStatus(401);
    }

})

app.delete("/users", jsonParser, async (req, res) => {

    const token = req.body.headers["x-access-token"]
    const { selectedUsers } = req.body

    try {
        const decoded = await jwt.verify(token, JWT_SECRET);

        const user = await User.findOne({ userName: decoded.userName }).lean()

        if (user.isBlocked) {
            return res.json(401, {})
        }

        if (decoded) {
            console.log(selectedUsers)

            selectedUsers.forEach(async id => {
                try {
                    await User.deleteOne({ _id: id })
                    return res.sendStatus(200)
                } catch (e) {
                    console.log(e)
                }
            });

        }

    } catch (e) {
        return res.sendStatus(401);
    }

})

app.patch("/users/block", jsonParser, async (req, res) => {
    const { selectedUsers } = req.body

    const token = req.headers["x-access-token"]

    try {
        const decoded = await jwt.verify(token, JWT_SECRET);
        const user = await User.findOne({ userName: decoded.userName }).lean()

        if (user.isBlocked) {
            return res.sendStatus(401);
        }

        if (decoded) {

            selectedUsers.forEach(async id => {
                try {
                    await User.findOneAndUpdate({ _id: id }, { isBlocked: true });

                } catch (e) {
                    console.log(e)
                }
            });
        }
        return res.sendStatus(200)

    } catch (e) {
        return res.sendStatus(401);
    }
});

app.patch("/users/unblock", jsonParser, async (req, res) => {
    const { selectedUsers } = req.body

    const token = req.headers["x-access-token"]

    try {
        const decoded = await jwt.verify(token, JWT_SECRET);

        const user = await User.findOne({ userName: decoded.userName }).lean()

        if (user.isBlocked) {
            return res.sendStatus(401);
        }

        if (decoded) {

            selectedUsers.forEach(async id => {
                try {
                    await User.findOneAndUpdate({ _id: id }, { isBlocked: false });

                } catch (e) {
                    console.log(e)
                }
            });
        }
        return res.sendStatus(200)

    } catch (e) {
        return res.sendStatus(401);
    }
});