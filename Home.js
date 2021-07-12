/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useState } from 'react';
import { AppState, StyleSheet} from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Homeheader from './Homeheader';
import DrawerData from './Drawer';
import firestore from '@react-native-firebase/firestore';
import { login, selectUser } from './features/userSlice'
import { useSelector } from 'react-redux';

const Drawer = createDrawerNavigator();
const Home = ({ navigation, route }) => {
        const userData = useSelector(selectUser);
        // Status ONline or OFFline
        const appState = useRef(AppState.currentState);
        const [appStateVisible, setAppStateVisible] = useState(appState.current);
      
        useEffect(() => {
          AppState.addEventListener("change", handleAppStateChange);
      
          return () => {
            AppState.removeEventListener("change", handleAppStateChange);
          };
        }, []);
      
        const handleAppStateChange = (nextAppState) => {
          if (appState.current.match(/active/) && nextAppState === "background"){
              firestore().collection('users').doc(userData.UID).update({
                status:"Offline",
              })
          }
          else{
            firestore().collection('users').doc(userData.UID).update({
              status:"Online",
            })
          }
          appState.current = nextAppState;
          setAppStateVisible(appState.current);
        };

        //For first time
        useEffect(() => {
          firestore().collection('users').doc(userData.UID).update({
            status:"Online",
          })
        }, [])
        

  return (
    <>
    {/* {console.log(route.params.id)} */}
    <Drawer.Navigator drawerPosition='right' drawerContent={props => <DrawerData {...props}/>}>
        <Drawer.Screen name="Home" component={Homeheader} />
    </Drawer.Navigator>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({

});
