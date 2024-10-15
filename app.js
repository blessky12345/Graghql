const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const app=express();

app.use(cors());

mongoose.connect('mongodb+srv://oisaiahayodeji:nmHyBL9THxC1R0hq@cluster0.ymgt1o1.mongodb.net/gqlBooks?retryWrites=true&w=majority&appName=Cluster0');
// mongoose.connect('mongodb+srv://oisaiahayodeji:<db_password>@cluster0.ymgt1o1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
mongoose.connection.once( 'open', () => {
    console.log('Connected to Database');
})

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(4000, () => {
    console.log('now listening for requests on port 4000');
});