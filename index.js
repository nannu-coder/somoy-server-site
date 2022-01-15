const express = require('express')
const { MongoClient } = require('mongodb');
const admin = require("firebase-admin");
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express()
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aik0x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const serviceAccount = {
    "type": "service_account",
    "project_id": "times-somoy",
    "private_key_id": "54a63ae428de96786feaaf25dc012b92e4998ffc",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDNMWIC2OMd/p7T\nwTO1b0ws1/4i5BrmZY1d/T0UKqE+NzW6FvwnUTHxsgw7NOaO9WNGb/lSNrXsuPDX\nTUZ0TE1G5qwZa/qlw1eOyagSpCxKaIGuZaMNkUr/tuska8WzmtW500K53fr/mtep\nGqTmeCIZtb3RBnCyEZoR4X0xiP5UCXizElfVQy8o2WX0MAW4dI7e6Fb6xFFSxR9/\nZJyhYP7O4AnYppj+jZPRIhvmu7iJ+lr+UPFkNcaR2c9Rg9zBLooqk0ZwpxXGeVIA\nH24sigf34w6u++3iM5of/MzviPpTcm2rxJ5Efr0NWwYpO6eyjsJm5OZZmrfD8J0n\nW76GJDbfAgMBAAECggEAPohosq5vVLJGrAjqncX75IS0teRnUEStlvG4nf854ZCI\nxpv/n2nOuzZEJP0DsJiW9x3j0QrMWYapGyw5JvMj79IXq62tFrxX4DOTjY7L0qdT\nshbWYKmhPhn8Qj634vryXG3GHYfJWQFS7P2qOHRvC//Hh76bNKFJn15lPWXfADPR\nCXe7AHklz4/qcAFJ3qthP11I7kK+Ah6DfWBZ2Htw8ix2tgGA6h0vGxt3SfW8eSm2\nd+LZ1B/9St0LUXuxZid/OmKbN1U1ll7SaWOD58eK5aIb8P3RQ+XGq7apt5ttJv/U\ne0HCZMQ1RtMZ1xDBdBXgxSshw8Yh4l4U2y/6OUFJQQKBgQDneJPFBrigUH2hhq3C\ncUN+c11fx94774yFPKYjrJkpdbSbttGW0/kQGK/6sZkCUPkevdoEzFQY0wn+rhIs\nW/8e2Cb4WfvLwbe/arj+dfVqrsEVHkXmms6p8QXdU7vVyKD5hVLHUCGDNd2k+mCQ\nPcjWDdi7eK5hxwzjOZX2Oy1LnwKBgQDi7+yqGAQv6+pOQbbrUVPDNB53kRY8ZLUp\nsPvq1iSOl/OXec2WjEzpl1swAAM7ikKAQsfLU1Dl9XzJWEmuKrz6g/wKYvrS0e94\nCRy37IYvlxbkoFupMDgw5leRpUJHmXMhCiJFt7xJjKFHmM+9yuCwM1belTk++u9w\nUFENrZVMwQKBgGHt6p7OBCiXRT+kajk8kDCcgGG4frZe19W63hNzv20CBoJmq2+j\niNkdiL6IitKnDW7LJcUn6WCDUNQ2MywfU+Vpz7r83wHKmIHclh3aLBWRj9DueOZi\nkpLljPShq3N8KVbH6Ei5BySrEnXtFBOSgDjHrO1L1oM5oqMzxtVhHf3DAoGBAISx\nJQCP6mLa3rXDVuFhPEj3QJlJDGdju0oVYjd93wJBdv0rCzrr7kznYzo9x6YYwamd\nYpVQsgzD7aMNLIfaFYWlhsnL9j0u44acTV59vjg1b/1ehjn3J+Pvy2Qt7QNQhjDb\nbA630DBxOhxTDaU76wUb/79GIaLhtv9E9x+4T4QBAoGAcFQc2DL8oQ0fQ4HCF/0q\nW44ASzQVuhOlfVCALsMDcINV0NIOWUXJdHT6wkSTHehYZBD9SWlbz9xkk+vxQG12\nBqvqSySg7szsnjuNzBzebU3ff3ITZRhfqfn3+W4SNtwhMc6qEIcq+JfUjx9KiA6O\ntrhml7jE4EhZjdPdqlXxca4=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-zkc6w@times-somoy.iam.gserviceaccount.com",
    "client_id": "117876591146889090125",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-zkc6w%40times-somoy.iam.gserviceaccount.com"
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

async function verifyId(req, res, next) {
    if (req.headers.authorization.startsWith('bearer ')) {
        const token = req.headers.authorization.split(' ')[1];

        try {
            const decodedUser = await admin.auth().verifyIdToken(token);
            req.decodedEmail = decodedUser.email
        }
        catch {

        }
    }
    next();
}

async function run() {
    try {
        await client.connect();
        const database = client.db("somoy");
        const productCollection = database.collection("products");
        const ordersCollection = database.collection("orders");
        const usersCollection = database.collection("users");
        const reviewCollection = database.collection("review");

        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        })

        app.post('/products', async (req, res) => {
            const service = req.body;
            const result = await productCollection.insertOne(service);
            res.json(result)
        })

        app.post('/orders', async (req, res) => {
            const data = req.body;
            const result = await ordersCollection.insertOne(data)
            res.json(result)
        })

        app.get('/orders/allorders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const result = await cursor.toArray();
            res.json(result)
        })

        app.get('/orders', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const cursor = ordersCollection.find(query);
            const result = await cursor.toArray();
            res.json(result)
        })


        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result)
        })

        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        })

        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result)
        })

        app.put('/users/admin', verifyId, async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }
            const requester = req.decodedEmail;
            if (requester) {
                const requesterAccount = await usersCollection.findOne({ email: requester });
                if (requesterAccount.role === 'admin') {
                    const updateDoc = { $set: { role: 'admin' } }
                    const result = await usersCollection.updateOne(filter, updateDoc);
                    res.json(result)
                }
            }
        })

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin })
        })

        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.json(result)
        })

        app.get('/review', async (req, res) => {
            const cursor = reviewCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        })

        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result)
        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('somoy server running')
})

app.listen(port, () => {
    console.log(`port listening at http://localhost:${port}`)
})