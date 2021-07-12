import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Modal, Pressable,TextInput } from 'react-native'
import firestore from '@react-native-firebase/firestore';
import {selectUser} from './features/userSlice'
import { useSelector } from 'react-redux';


const Modalpage = ({navigation}) => {
    const [fname, setFname] = useState();
    const userdata = useSelector(selectUser);
    const friendHandler=()=>{
      firestore().collection('username').doc(fname?.toLowerCase()).get().then((doc)=>{
        if(doc.exists){
          const temp = doc.data().id;
          firestore().collection('users').doc(userdata?.UID).collection('friends').doc(temp).set({
            username: fname,
          })
          firestore().collection('users').doc(userdata.UID).get().then((doc)=>{
            const myname = doc.data().username
            firestore().collection('users').doc(temp).collection('friends').doc(userdata?.UID).set({
              username:myname,
            })
          })
          alert("Friend added")
        }
        else{
          alert("User Does not Exists")
        }
      }).catch(e=>console.log(e))
      navigation.pop()
    }
    return (
        <View>
            
            {/* Modal start */}

              <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={true}
                    onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                    }}
                >
                    <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Add Friend</Text>
                        <TextInput style={styles.username}
                            placeholder={"Enter Username"}
                            onChangeText={(e)=>setFname(e)}
                            value={fname}
                        />
                        <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => friendHandler() }
                        >
                        <Text style={styles.buttomStyle}>+</Text>
                        </Pressable>
                    </View>
                    </View>
                </Modal>
                
            </View> 
                        
            {/* modal end */}
        </View>
    )
}

export default Modalpage

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        paddingTop:10,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      button: {
        borderRadius: 20,
        padding: 2,
        elevation: 2,
        color:'#ffc406'
      },
      buttonOpen: {
        backgroundColor: "#F194FF",
      },
      buttonClose: {
        backgroundColor: "#2196F3",
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 20,
        textAlign: "center",
        fontWeight:'bold',
        color:'black'
      },
      username:{
          borderWidth:1,
          minWidth:'60%',
          borderRadius:20,
          marginBottom:10
      },
      buttomStyle:{
        fontSize:30,
        color:'white',
        paddingLeft:10,
        paddingRight:10,
        
      }
})
