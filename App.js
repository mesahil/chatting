import React from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import Login from './Login';
import Home from './Home';
import {createStackNavigator} from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import {Provider} from 'react-redux';
import reduxStore from './app/store';
import { PersistGate } from 'redux-persist/integration/react'
import Messages from './Messages';
import Modalpage from './Modalpage';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#ffe388',
    text:'black',
  },
};


const Stack = createStackNavigator();
const MyStack = () => {
  return (
    <Stack.Navigator initialRouteName={auth().currentUser!==null?('Home'):('Login')} screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Home" component={Home}/>
      <Stack.Screen name='Messages' component={Messages}/>
      <Stack.Screen name='Modal' component={Modalpage}/>
    </Stack.Navigator>
  );
}

const App = () => {
  const {store, persistor} = reduxStore();
  return (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor} >
            <PaperProvider theme={theme}>
                <NavigationContainer>
                    <MyStack />
                </NavigationContainer>
            </PaperProvider>
        </PersistGate>
    </Provider>
  );
};
export default App;
