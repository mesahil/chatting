import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'


const call = () =>{
    fetch('http://192.168.1.8:5001/index/send',{
        method: 'POST',

    }).then(()=>console.log("sent")).catch((e)=>console.log("Erooooooo"))
}
const Status = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Please hold on Comming Soon!!</Text>
            <Button title={'Send'} onPress={()=>call()}/>
        </View>
    )
}

export default Status

const styles = StyleSheet.create({
    text:{
        fontWeight:'bold',
    },
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})
