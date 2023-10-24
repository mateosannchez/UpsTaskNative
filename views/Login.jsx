import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react'
import { StyleSheet, View, Button, TextInput, Text, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal';
import { gql, useMutation } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTENTICAR_USUARIO = gql`
  mutation autenticarUsuario($input: AutenticarInput) {
    autenticarUsuario(input: $input) { 
      token
    }
  }
`

const Login = () => {

  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState(null)

  const navigation = useNavigation();

  const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO)

  const handleSubmit = async () => {
    if ( email === '' || password === '') {
      setMensaje('Todos los campos son obligatorios');
      return;
    }

    try {
      const {data} = await autenticarUsuario({
        variables: {
          input: {
            email,
            password
          }
        }
      })

      const {token} = data.autenticarUsuario

      await AsyncStorage.setItem('token', token);

      navigation.navigate('Proyectos')

    } catch (error) {
      setMensaje(error.message.replace('GraphQL error: ', ''));
    }
  }

  const mostrarAlerta = () => {
    return (
      <Modal isVisible={mensaje !== null}>
        <View style={styles.alerta}>
          <Text style={[styles.botonTexto, { textAlign: 'center', fontSize: 20, marginBottom: 20 }]}>{mensaje}</Text>
          <TouchableOpacity
            style={styles.boton}
            onPress={() => setMensaje(null)}
          >
            <Text style={styles.botonTexto}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  return (
    <View style={[styles.contenedor, { backgroundColor: '#e84347' }]}>

      <View style={styles.contenido}>
        <Text style={styles.titulo}>Upstask</Text>


        <View style={styles.inputContainer}>

          <TextInput
            placeholder='Email'
            style={styles.input}
            value={email}
            onChangeText={(text) => setEmail(text.toLowerCase())}
          />
        </View>
        <View style={styles.inputContainer}>

          <TextInput
            placeholder='Password'
            secureTextEntry={true}
            style={styles.input}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </View>

        <TouchableOpacity
          style={styles.boton}
          onPress={() =>{
            handleSubmit()
          }}
        >
          <Text style={styles.botonTexto}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <Text 
          onPress={() => navigation.navigate('CrearCuenta')} 
          style={styles.enlace}
          >
            Crear Cuenta
          </Text>

          {mensaje && mostrarAlerta()}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
  },
  contenido: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginHorizontal: '2.5%',
    flex: 1,
  },
  titulo: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white'
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    height: 45,
  },
  boton: {
    backgroundColor: '#28303B',
    marginTop: 20,
    borderRadius: 5,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  botonTexto: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: 'white'
  },
  enlace: {
    color: 'white',
    marginTop: 60,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    textTransform: 'uppercase'
  }
})

export default Login