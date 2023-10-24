import { gql, useMutation } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react'
import { StyleSheet, View, Button, TextInput, Text, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal';
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

if (__DEV__) {  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

const NUEVA_CUENTA = gql`
  mutation crearUsuario($input: UsuarioInput) {
    crearUsuario(input: $input)
  }
`

const CrearCuenta = () => {

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [mensaje, setMensaje] = useState(null)

  const navigation = useNavigation();

  const [crearUsuario] = useMutation(NUEVA_CUENTA)

  const handleSubmit = async () => {
    if (nombre === '' || email === '' || password === '') {
      setMensaje('Todos los campos son obligatorios');
      return;
    } else {
      setMensaje(null); // Limpia el mensaje si los campos están llenos
    }

    if (password.length < 6) {
      setMensaje('El password debe ser de al menos seis caracteres');
      return;
    }

    try {
      const {data} = await crearUsuario({
        variables: {
          input: {
            nombre,
            email,
            password
          }
        }
      })

      setMensaje(data.crearUsuario);
      navigation.navigate('Login')

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
            placeholder='Nombre'
            style={styles.input}
            value={nombre}
            onChangeText={(text) => setNombre(text)}
          />
        </View>

        <View style={styles.inputContainer}>

          <TextInput
            placeholder='Email'
            style={styles.input}
            value={email}
            onChangeText={(text) => setEmail(text)}
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
          onPress={() => handleSubmit()}
        >
          <Text style={styles.botonTexto}>Crear Cuenta</Text>
        </TouchableOpacity>

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

export default CrearCuenta