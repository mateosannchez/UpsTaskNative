import { gql, useQuery } from '@apollo/client'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity, } from 'react-native'

const OBTENER_PROYECTOS = gql`
query obtenerProyectos{
  obtenerProyectos {
    id
    nombre
  }
}
`
const Proyectos = () => {

  const navigation = useNavigation();

  const {data, loading, error} = useQuery(OBTENER_PROYECTOS)

  return (
    <View style={[styles.contenedor , {backgroundColor: 'E84347'}]}>
        <TouchableOpacity 
          style={[styles.boton, {marginTop: 30}]}
          onPress={() => navigation.navigate('NuevoProyecto')}
        >
          <Text>Nuevo Proyecto</Text>
        </TouchableOpacity>

        <Text style={styles.subtitulo}>Selecciona un Proyecto</Text>
   
        <View>
          <View style={styles.contenido}> 
            {data.obtenerProyectos.map(proyecto => (
              <View 
                key={Proyectos.id}
                onPress={() => navigation.navigate('Proyecto', proyecto)}
              >
                <View>
                  <Text>{proyecto.nombre}</Text>
                </View>
                <View>

                </View>
              </View>
            ))}
          </View>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
  },
  contenido: {
    marginHorizontal: '2.5%',
    flex: 1,
    backgroundColor: 'white'
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

export default Proyectos