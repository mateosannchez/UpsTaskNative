import { gql, useMutation } from '@apollo/client';
import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';

const ACTUALIZAR_TAREA = gql`
mutation actualizarTarea($id: ID!, $input: TareaInput, $estado: Boolean) {
    actualizarTarea(id: $id, input: $input, estado: $estado) {
        nombre
        id
        proyecto
        estado
    }
}
`

const ELIMINAR_TAREA = gql`
mutation eliminarTarea($id: ID!) {
    eliminarTarea(id: $id) 
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

const Tarea = ({ tarea, proyectoId }) => {

    const [actualizarTarea] = useMutation(ACTUALIZAR_TAREA)

    const [eliminarTarea] = useMutation(ELIMINAR_TAREA, {
        update(cache) {
            const {obtenerTareas} = cache.readQuery({
                query: OBTENER_TAREAS,
                variables: { 
                    proyecto: proyectoId 
                },
            })

            cache.writeQuery({
                query: OBTENER_TAREAS,
                variables: {
                    input: {
                        proyecto: proyectoId
                    }
                },
                data: {
                    obtenerTareas: obtenerTareas.filter( tareaActual => tareaActual.id !== tarea.id)
                }
            })
        }
    })

    const cambiarEstado = async () => {
        
        const {id} = tarea

        try {
            const {data} = await actualizarTarea({
                variables : {
                    id,
                    input: {
                        nombre: tarea.nombre
                    },
                    estado: !tarea.estado
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    const mostrarELiminar = () => {
        Alert.alert('Eliminar Tarea', '¿Deseas Eliminar esta Tarea?', [
            {
                text: 'Cancelar',
                style: 'cancel'
            },
            {
                text:'Confirmar',
                onPress:()=>{
                    eliminarTareaDB()
                }
            }
        ])
    }

    const eliminarTareaDB = async () => {
        const {id} = tarea;

        try {
            const {data} = await eliminarTarea({
                variables:{
                    id
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
        <TouchableOpacity 
            onPress={() => cambiarEstado()}
            onLongPress={() => mostrarELiminar()}
            >
            <View>
                <Text>{tarea.nombre}</Text>
            </View>

            <View>
                {tarea.estado ? (
                    <Icon 
                        style={[styles.icono, styles.completo]}
                        name="ios-checkmark-circle" 
                    />
                ) : (
                    <Icon 
                        style={[styles.icono, styles.incompleto]}
                        name="ios-checkmark-circle" 
                    />
                )}
                
            </View>
        </TouchableOpacity>
        </>
    )
}

const styles = StyleSheet.create({
    icono: {
        fontSize: 32
    },
    completo: {
        color: 'green'
    },
    incompleto: {
        color: '#E1E1E1'
    },
})

export default Tarea