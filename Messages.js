/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Button, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Avatar, IconButton } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';
import {selectUser} from './features/userSlice'



const Messages = ({navigation,route}) => {
    const userdata = useSelector(selectUser);
    const [mess,setMess] = useState([]);
    const [text, setText] = useState('');
    const [fStatus, setFStatus] = useState("");
    const flatlistRef = useRef();
    const fb = firestore().collection('chats').doc(route.params?.chatid).collection('messages');
    useEffect(() => {    
        
        firestore().collection('users').doc(route.params?.id).onSnapshot((snap)=>
            setFStatus(snap.data().status)
        )
        
        fb.orderBy('timestamp','desc').onSnapshot((snapshot)=>
        setMess(snapshot.docs.map((doc) =>({
            sid:doc.data().sid,
            message:doc.data().text,
            time:doc.data().timestamp,
        })))    
        );
    
        
    }, []);


    if(mess.length>=1 && route.params?.fid){
        // for self
        firestore().collection('users').doc(userdata?.UID).collection('chats').doc(route.params?.fid).set({
            chatid:route.params?.chatid,
            uname:route.params.name
        })

        // for friend
        firestore().collection('users').doc(userdata?.UID).get().then((docData)=>{
            firestore().collection('users').doc(route.params?.fid).collection('chats').doc(route.params?.fid).set({
                chatid:route.params?.chatid,
                uname:docData.data().username,
            })
        })
    }


    const sendMessage = async () =>{
        await fb.doc().set({
            sid:userdata?.UID,
            text:text,
            timestamp:firestore.FieldValue.serverTimestamp(),
        })
        setText('');
    }
    

    return (
        <View style={{flex:1,}}>
            <View style={{justifyContent:'space-between',height:'100%'}}>

                {/* header */}
                <View style={styles.header}>
                    <Avatar.Text size={50} label="XD" />
                    <View >
                        <Text style={{fontWeight:'bold', fontSize:20, paddingLeft:10}}>{route?.params?.name}</Text>
                        <Text style={{paddingLeft:10}}>{fStatus}</Text>
                    </View>
                </View>
                {/* Messages list */}
                
                <FlatList
                    ref={flatlistRef}
                    data={mess}
                    renderItem={({item})=>(
                        <View style={item.sid==userdata?.UID?([styles.messagesSentBox]):([styles.messagesReceivedBox])}>
                            <View style={item.sid==userdata?.UID?(styles.messagesSent):(styles.messagesReceived)}>
                                <Text style={{color:'black'}}>{item.message}</Text>
                            </View>
                        </View>
                    )}
                    keyExtractor={(item)=>item.message}
                    inverted
                />
                
                
                {/* Text area and send  */}
                <View style={styles.sendMessage}>
                    <IconButton icon="sticker-emoji" size={20} onPress={()=>toEnd()}/>
                    <TextInput placeholder="send messages" style={{width:'62%'}}
                    value={text}
                    onChangeText={(v)=>setText(v)}
                    />
                    <IconButton icon="attachment" size={20} />
                    <IconButton icon="send" size={20}  onPress={sendMessage}/>
                </View>
                
            </View>
        </View>
    );
};
export default Messages;

const styles = StyleSheet.create({
    header:{
        backgroundColor:'#ffc406',
        padding: 10,
        flexDirection:'row',
        alignItems:'center',
    },
    messagesSentBox:{
        flex:1,
        padding:5,
        alignItems:'flex-end',
    },
    messagesReceivedBox:{
        flex:1,
        padding:5,
        alignItems:'flex-start'
    },
    sendMessage:{
        margin:10,
        borderStyle:'solid',
        borderWidth:1,
        borderRadius:7,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-end'
    },
    messagesSent:{
        // alignItems:'flex-end',
        // justifyContent:'flex-end',
        backgroundColor:'#eedc82',
        padding: 10,
        borderRadius:10,
        maxWidth:'80%',

    },
    messagesReceived:{
        backgroundColor:'#d1d1d1',
        padding: 10,
        borderRadius:10,
        maxWidth:'80%',
        
    },
});
