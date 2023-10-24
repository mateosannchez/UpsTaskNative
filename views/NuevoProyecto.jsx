import { gql, useMutation } from '@apollo/client';
import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native'
import Modal from 'react-native-modal';

const NUEVO_PROYECTO = gql`
  mutation nuevoProyecto($input: ProyectoInput) {
    nuevoProyecto(input : $input){
        nombre
        id
    }
  }
`

const OBTENER_PROYECTOS = gql`
query obtenerProyectos{
  obtenerProyectos {
    id
    nombre
  }
}
`

const NuevoProyecto = () => {

    const [nombre, setNombre] = useState('')
    const [mensaje, setMensaje] = useState(null)

    const [nuevoProyecto] = useMutation(NUEVO_PROYECTO, {
        update(cache, {data: {nuevoProyecto}}) {
            const { obtenerProyectos } = cache.readQuery({ query: OBTENER_PROYECTOS});
            cache.writeQuery({
                query: OBTENER_PROYECTOS,
                data: { obtenerProyectos: obtenerProyectos.concat([nuevoProyecto]) }
            })
        }
    })

    const navigation = useNavigation()

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

    const handleSubmit = async () => {
        if (nombre === '') {
            setMensaje('EL nombre del proyecto es obligatorio');
            return;
        }

        try {
            const {data} = await nuevoProyecto({
                variables: {
                    input:{
                        nombre
                    }
                }
            })
            setMensaje('Proyecto creado correctamente')
            navigation.navigate('Proyectos')
        } catch (error) {
            //console.log(error);
            setMensaje(error.message.replace('GraphQL error:', ''))
        }

    }

    return (
        <View style={[styles.contenedor, { backgroundColor: 'E84347' }]}>

            <View style={styles.contenido}>
                <Text style={styles.subtitulo}>Nuevo Proyecto</Text>

                <View>
                    <TextInput
                        style={styles.input}
                        placeholder='Nombre del Proyecto'
                        onChangeText={text => setNombre(text)}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.boton, { marginTop: 30 }]}
                    onPress={() => handleSubmit()}
                >
                    <Text style={styles.botonTexto}>Crear Proyecto</Text>
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
    subtitulo: {
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 26,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 20,
    }
})

export default NuevoProyecto