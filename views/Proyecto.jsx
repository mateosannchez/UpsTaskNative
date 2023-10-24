import { gql, useMutation, useQuery } from '@apollo/client';
import React, {useState} from 'react'
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native'
import Modal from 'react-native-modal';
import Tarea from '../components/Tarea';

const NUEVA_TAREA = gql`
mutation nuevaTarea($input: TareaInput) {
  nuevaTarea(input: $input){
      nombre
      id
      proyecto
      estado
  }
}
`

const OBTENER_TAREAS = gql`
  query obtenerTareas($input: ProyectoIDInput) {
    obtenerTareas(input: $input) {
      id
      nombre
      estado
    }
  }
`

const Proyecto = ({ route }) => {

  const {id} = route.params

  const [nombre, setNombre] = useState('')
  const [mensaje, setMensaje] = useState(null)

  const {data, loading, error} = useQuery(OBTENER_TAREAS, {
    variables: {
      input:{
        proyecto: id
      },
    }
  })

  const [nuevaTarea] = useMutation(NUEVA_TAREA, {
    update(cache, {data: {nuevaTarea}}) {

      const {obtenerTareas} = cache.readQuery({
        query: OBTENER_TAREAS,
        variables: {
          input: {
            proyecto: id
          }
        }
      })

      cache.writeQuery({
        query: OBTENER_TAREAS,
        variables: {
          input: {
            proyecto: id
          }
        },
        data: {
          obtenerTareas: [...obtenerTareas, nuevaTarea]
        }
      })
    }
  })

  const handleSubmit = async () => {
    if (nombre === '') {
      setMensaje('El nombre de la tarea es obligatorio')
      return;
    }

    try {
      const {data} = await nuevaTarea({
        variables: {
          input: {
            nombre,
            proyecto: id
          }
        }
      })
      setNombre('')
      setMensaje('Tarea creada correctamente')

      setTimeout(() => {
        setMensaje(null)
      }, 3000)

    } catch (error) {
      console.log(error);
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

if(loading) return <Text>Cargando...</Text>

  return (
    <View style={[styles.contenedor, { backgroundColor: '#e84347' }]}>
      <View style={{ marginHorizontal: '2.5%', marginTop: 20 }}>

        <View >
          <TextInput
            style={styles.input}
            placeholder='Nombre Tarea'
            value={nombre}
            onChangeText={ text => setNombre(text)}
          />
        </View>

        <TouchableOpacity 
          style={styles.boton}
          onPress={() => handleSubmit()}
          >
          <Text>Crear Tarea</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitulo}>Tareas: {route.params.nombre}</Text>
      
      <View>
        <View style={[styles.contenido, {backgroundColor: 'white'}]}>
          {data.obtenerTareas.map(tarea => (
            <Tarea
              key={tarea.id}
              tarea={tarea}
              proyectoId={id}
            />
          ))}
        </View>
      </View>
      
      {mensaje && mostrarAlerta()}
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
subtitulo: {
  textAlign: 'center',
  marginBottom: 20,
  fontSize: 26,
  fontWeight: 'bold',
  color: 'white',
  marginTop: 20,
}
})

export default Proyecto