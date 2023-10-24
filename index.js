// import React from 'react';
// import {AppRegistry} from 'react-native';
import App from './App';
// import {name as appName} from './app.json';

// Apollo
import { ApolloProvider } from '@apollo/client'
import client from './config/Apollo';

const upTaskApp = () => (
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
)

AppRegistry.registerComponent(appName, () => upTaskApp);
