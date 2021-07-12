import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity  } from 'react-native'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Avatar, Button } from 'react-native-paper';
import {logout} from './features/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import {selectUser} from './features/userSlice'
// import Modalpage from './Modalpage'

// fid when someone add friend us 
const DrawerData = ({navigation}) => {
    const [friends , setFriends ]=useState([]);
    const [name, setName]= useState('');
    const dispatch = useDispatch();
    const userdata = useSelector(selectUser);
    useEffect(() => {
        firestore().collection('users').doc(userdata?.UID).collection('friends').onSnapshot((snapshot)=> 
            setFriends(snapshot.docs.map((doc) =>({
                fid: doc.id,
                name:doc.data().username
            })))
        );
        // check here 
        firestore().collection('users').doc(userdata?.UID).get().then(q=>{
            setName(q.data().username)
        })
    },[]);
    const friendlist = () =>{
        navigation.closeDrawer();
        navigation.navigate('Modal')
    }
    // console.log(allusers);
    return (
        <View style={styles.container}>
            <View style={styles.pro}>
                <View style={{flexDirection:'row',alignItems:'center',paddingBottom:10}}>
                    <Avatar.Text label={name[0]} size={45}  style={{color:"#ffc406"}}/>
                    <Text style={{paddingLeft:10,fontWeight:'bold',fontSize:20}}>{name}</Text>
                </View>
                <Button mode="contained" onPress={()=>friendlist()}><Text style={{fontWeight:'bold'}}>ADD Friend</Text></Button>
            </View>
            {/* {console.log(friends)} */}
            <FlatList
                data={friends}
                renderItem={({item})=>(
                    <TouchableOpacity onPress={()=>
                        {
                            navigation.navigate('Messages',{id:item.fid, name:item.name,fid:item.fid, 
                                chatid:item.fid>userdata?.UID?((item.fid+userdata?.UID).replace(/\s/g, '')):((userdata?.UID+item.fid).replace(/\s/g, ''))})
                            navigation.closeDrawer()
                        }                       
                    }>
                        <View style={styles.Listcontainer} >
                            <Avatar.Text size={35} label={item.name[0]} />
                            <Text style={{paddingLeft:5, fontSize:15}}>{item.name}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item)=>item.fid}
            />

            <View style={styles.logout}>
            <Button icon="logout" mode="contained" onPress={()=>{
                auth().signOut();
                dispatch(logout());
                navigation.navigate('Login')
            }}>Logout</Button>
            </View>
            {/* <Modalpage props={modalVisible}/> */}
        </View>
    )
}

export default DrawerData

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'space-between'
    },
    pro:{
        borderBottomWidth:4,
        borderColor:'grey',
        padding:10,
        
    },
    logout:{
        // paddingBottom:10

    },
    Listcontainer:{
        flexDirection:'row',
        borderColor:'#f1f1ef',
        borderBottomWidth:0.5,
        padding:5,
        alignItems:'center'
    },
    
})

