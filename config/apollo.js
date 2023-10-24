import { ApolloClient } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { InMemoryCache } from "apollo-cache-inmemory";
import { setContext } from "apollo-link-context";
import { HttpLink, createHttpLink } from "apollo-link-http";
import { Platform } from "react-native";

const httpLink = createHttpLink({
    uri: Platform.OS === 'ios' ? 'http://localhost:4000' : 'http://10.0.2.2:4000/' 
})

const authLink = setContext( async (_, {headers}) => {
    
    const token = await AsyncStorage.getItem('token');

    return { 
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    }
} )

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink)
})

export default client

// import { ApolloClient } from '@apollo/client';
// import { InMemoryCache } from 'apollo-cache-inmemory';
// import { createHttpLink } from 'apollo-link-http';
// import { setContext } from 'apollo-link-context';

// import AsyncStorage from '@react-native-community/async-storage';

// const httpLink = createHttpLink({
//     uri: ''
// })

// const authLink = setContext( async (_, { headers}) => {
//     // Leer el token
//     const token = await AsyncStorage.getItem('token');

//     return {
//         headers: {
//             ...headers,
//             authorization: token ? `Bearer ${token}` : ''
//         }
//     }
// } )


// const client = new  ApolloClient({
//     cache: new InMemoryCache(),
//     link: authLink.concat(httpLink)
// });

// export default client;