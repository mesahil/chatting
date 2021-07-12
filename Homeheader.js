import React from 'react'
import { StyleSheet, Text, View} from 'react-native';
import {Button } from 'react-native-paper'
import Icon from 'react-native-vector-icons/FontAwesome';
import Chat from './Chat';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Status from './Status';

const Tab = createMaterialTopTabNavigator();

const Homeheader = ({ navigation }) => {
    return (
        <>
          <View style={styles.header}>
              <View style={styles.headerTop}>
                <Text style={styles.headerText}>Chat App</Text>
                <Button onPress={()=>{
                  navigation.openDrawer()}
                }>
                  <Icon name='bars' size={20} color='white'/>
                </Button>  
              </View>
          </View>
          <Tab.Navigator tabBarOptions={{activeTintColor:'white',labelStyle:{fontWeight:'bold'} ,tabStyle:{backgroundColor:'#ffc406'}}}>
              <Tab.Screen name="Chats" component={Chat} />
              <Tab.Screen name="Status" component={Status} />
              <Tab.Screen name="Call" component={Status} />
          </Tab.Navigator>
       </>
    )
}

export default Homeheader
const styles = StyleSheet.create({
    header: {
      height: 70,
      backgroundColor: '#ffc406',
      padding: 10,
    },
    headerText: {
      fontWeight: 'bold',
      fontSize: 27,
      color:'white'
    },
    headerTop: {
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
  });
  
