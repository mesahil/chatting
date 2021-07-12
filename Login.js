/* eslint-disable quotes */
/* eslint-disable semi */
/* eslint-disable prettier/prettier */
import React from 'react'
import { useState } from 'react'
import {Button, StyleSheet, Text, TextInput, View,Modal } from 'react-native'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging'
import { useDispatch, useSelector } from 'react-redux'
import { login, selectUser } from './features/userSlice'
import OTPInputView from '@twotalltotems/react-native-otp-input'


// import { Modal} from 'react-native-paper';


const Login = ({navigation}) => {
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [isDisabled, setIsDisabled] = useState(false);
    const [title, setTitle] = useState('Send OTP');
    const [confirm, setConfirm] = useState(null);
    const [otp, setOtp] = useState('');
    const [visible, setVisible] = useState(false);
    const [name,setName] = useState("");
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const clean = () =>{
        setIsDisabled(false)
        setConfirm(null)
        setTitle('Send OTP')
        setOtp('')
    }
    const verify = async ()=>{
        setIsDisabled(true);
        const Number = '+91' + phoneNumber;
        try{
            const confirmation = await auth().signInWithPhoneNumber(Number);
            setConfirm(confirmation);
            setTitle('confirm')
        }
        catch(e){
            alert("Something went wrong")
            setIsDisabled(false);
        }
        
    }
    const setdata = () =>{
        if(name===""){
            alert("Name can't be empty!!")
        }
        else{
            const tname = name.toLowerCase();
            console.log(tname)
            firestore().collection('username').doc(tname).get().then((doc)=>{
                if(doc.exists){
                    alert("username already taken!")
                }
                else{
                    firestore().collection('username').doc(tname).set({
                        id:user.UID,
                    })
                    setVisible(false)
                    firestore().collection('users').doc(user.UID).set({
                        username:tname,
                    })
                    gohome(user.UID);
                }
            })
        }
    }
    const gohome = (id) =>{
        navigation.replace('Home')
        token(id);
        clean();
    }

    const token = async (id) =>{
        const token_id = await messaging().getToken();
        firestore().collection('users').doc(id).update({
            token:token_id,
          })
    }


    const confirmCode = async ()=>{
        setIsDisabled(true);
        try {
            const use = await confirm.confirm(otp);
            // console.log(use);
            // console.log("this is" + use.additionalUserInfo.isNewUser);
            //redux start
            dispatch(login({
                Phone:use.user.phoneNumber,
                UID:use.user.uid,
            }))
            //redux end
            use.additionalUserInfo.isNewUser?(setVisible(true)):(gohome(use.user.uid));
        
          } catch (error) {
            console.log(error)
            alert('Invalid code.');
          }
    }
    return (
        <View style={styles.container}>
            <View>
                <View style={styles.center}>
                    <Text style={styles.text}>Enter your phone number</Text>
                </View>
                <View style={styles.center}>
                    <Text style={styles.textInfo}>We will send an SMS to verify your phone number</Text>
                </View>
                <View style={[styles.input, styles.center]}>
                    <Text style={styles.inputText}>+91</Text>
                    <TextInput keyboardType="numeric"
                    placeholder="10 Digit Number"
                    maxLength={10}
                    onSubmitEditing={verify}
                    style={styles.inputTextNumber}
                    value={phoneNumber}
                    fontSize={18}
                    onChangeText={(e)=>{
                        setPhoneNumber(e);
                    }}/>
                </View>
            </View>
            <Modal visible={visible} transparent={true}>
                <View style={{flex:1,justifyContent:'center',backgroundColor:'rgba(0,0,0,0.5)'}}>
                <View style={{backgroundColor:"white",paddingTop:15,paddingBottom:15}}>
                <Text style={{fontSize:15,fontWeight:'bold'}}>Please enter your name</Text>
                <TextInput style={{borderColor:"black",borderBottomWidth:1,marginBottom:10}}
                 placeholder="username"
                 value={name}
                 onChangeText={(e)=>setName(e)}
                 />
                <Button title="Enter" color="green" onPress={setdata}/>
                </View>
                </View>
            </Modal>
            {(confirm?(
                // <View style={styles.otp}>
            //     {...{borderBottomColor:'green', borderBottomWidth:2,width:'20%'}}
            //     value={otp} 
            //     onChangeText={(v)=>{
            //         setOtp(v)
            //         // console.log(otp.length);
            //         otp.length===5?(setIsDisabled(false)):(setIsDisabled(true))
            //     }}
            //     />
            // </View>
            
            
            <OTPInputView style={styles.otp} pinCount={6} autoFocusOnLoad={false} codeInputFieldStyle={styles.color}
            onCodeFilled={(code=>{
                setOtp(code);
                setIsDisabled(false)
            })}/>
            
            ):(null))}
            <Button color="#00cc00" title={title} disabled={isDisabled} onPress={()=>{
                title==='Send OTP'?(verify()):(confirmCode())
            }}/>
        </View>
    )
}

export default Login

const styles = StyleSheet.create({
    container:{
        justifyContent:'space-between',
        height:'99%',
    },
    center:{
        alignItems: 'center',
    },
    text:{
        fontWeight: "bold",
        color: "#075e54",
        fontSize: 18,
        paddingTop:10
    },
    textInfo:{
        fontSize: 15,
        paddingTop: 15,
    },
    input:{
        paddingTop:20,
        flexDirection:'row',
        justifyContent:'center',
        margin:0
    },
    inputText:{
        borderWidth:1,
        borderRadius:15,
        padding:11.8,
        borderColor:'grey',
        fontSize:18,
        marginRight:15
    },
    inputTextNumber:{
        borderWidth:1,
        borderRadius:15,
        padding:10,
        paddingLeft:20,
        paddingRight:0,
        borderColor:'grey'
    },
    otp:{
        alignItems:'center',
        width:'80%',
        marginLeft:'10%',
        position:'absolute',
        marginTop:'80%',
        
    },
    color:{
        color:'black',
        fontSize:14,
        borderRadius:15,
        borderColor:'grey'
    },
    paddingLeft:{
        paddingLeft:20,
    },
})
