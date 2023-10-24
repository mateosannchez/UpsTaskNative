import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler';
import CrearCuenta from './views/CrearCuenta'
import Login from './views/Login'
import Proyectos from './views/Proyectos';
import NuevoProyecto from './views/NuevoProyecto';
import Proyecto from './views/Proyecto';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen
          name='Login'
          component={Login}
          options={{
            title: 'Iniciar Sesion',
            headerShown: false
          }}
        />

        <Stack.Screen
          name='CrearCuenta'
          component={CrearCuenta}
          options={{
            title: 'Crear Cuenta',
            headerStyle: {
              backgroundColor: '#28303B'
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold'
            }
          }}
        />

        <Stack.Screen
          name='Proyectos'
          component={Proyectos}
          options={{
            title: 'Proyectos',
            headerStyle: {
              backgroundColor: '#28303B'
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold'
            }
          }}
        />
        <Stack.Screen
          name='NuevoProyecto'
          component={NuevoProyecto}
          options={{
            title: 'Nuevo Proyecto',
            headerStyle: {
              backgroundColor: '#28303B'
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold'
            }
          }}
        />
        <Stack.Screen
          name='Proyecto'
          component={Proyecto}
          options={ ({route}) => ({
            title: route.params.nombre,
            headerStyle: {
              backgroundColor: '#28303B'
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold'
            }
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {

  },
});
