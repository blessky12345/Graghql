const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');
const author = require('../models/author');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } = graphql;

// var books =[
//     {name: 'Half a yellow Sun', genre: 'yellow', id:'1', publisher: 'Pacesetters',authorId: '1'},
//     {name: 'Yellow Sun Glow', genre: 'oju', id:'2', publisher: 'Lartern Book',authorId: '2'},
//     {name: 'A Yellow Sun', genre: 'end', id:'3', publisher: 'Palm Tree',authorId: '3'},
//     {name: 'Yellow Sun Glow', genre: 'oju', id:'4', publisher: 'Lartern Book',authorId: '2'},
//     {name: 'The Moonlight', genre: 'back', id:'5', publisher: 'Palm Tree',authorId: '1'},
//     {name: 'The Moonlight Glow', genre: 'oju', id:'6', publisher: 'Lartern Book',authorId: '3'},
//     {name: 'A Yellow Sun Glow', genre: 'end', id:'7', publisher: 'Palm Tree',authorId: '3'},
// ];  

// var authors = [
//     {name: 'Patrick Rothfuss', age: 44, id: '1'},
//     {name: 'Brandon;  Sanderson', age: 42, id: '2'},
//     {name: 'Terry Pratchell', age: 55, id: '3'},
// ];

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
        publisher: {type: GraphQLString},
        author: {
            type: AuthorType,
            resolve(parent, args){
                console.log(parent);
                // return _.find(authors,{id:parent.authorId});
                return Author.findById(parent.authorId)
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
             // return _.filter(books, {authorId:parent.id});
             return Book.find({authorId:parent.id})
            }
        }
    })
});

const RootQuery = new GraphQLObjectType ({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: {id:{type: GraphQLID}},
            resolve(parent, args) {
                // return _.find(books, {id: args.id});
                return Book.findById(args.id);
            }
        },
        author: {
            type: AuthorType,
            args: {id:{type: GraphQLID}},
            resolve(parent, args) {
                // return _.find(authors, {id: args.id});
                return Author.findById(args.id);
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                // return books
                return Book.find({});
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args){
                // return authors
                return Author.find({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent,args){
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                genre: {type: new GraphQLNonNull(GraphQLString)},
                publisher: {type: new GraphQLNonNull(GraphQLString)},
                authorId: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent,args){
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    publisher: args.publisher,
                    authorId: args.authorId
                });
                return book.save();
            }
        }
    }
})


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})