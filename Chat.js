import React from 'react';
import { useIsFocused } from '@react-navigation/native';
import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import {Avatar} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import {useState, useEffect} from 'react';
import {selectUser} from './features/userSlice';
import {useSelector} from 'react-redux';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const Chat = ({navigation}) => {
  const [chats, setChats] = useState([]);
  const userdata = useSelector(selectUser);
  const [lastmsg, setLastmsg] = useState([]);
  const [lastchat, setLastchat] = useState([]);
  const last = [];
  const isFocused = useIsFocused();

  useEffect(() => {
      // console.log("last message screen ")
    firestore().collection('users').doc(userdata?.UID).collection('chats')
      .onSnapshot(snapshot => {
        snapshot.docs.map((doc, index) => {
          isFocused && setChats(prevState => {
            return [
              ...prevState,
              {
                id: doc.id,
                cid: doc.data().chatid,
                uname: doc.data().uname,
              },
            ];
          });
          firestore()
            .collection('chats')
            .doc(doc.data().chatid)
            .collection('messages')
            .orderBy('timestamp', 'desc')
            .limit(1)
            .onSnapshot(snap => {
                // console.log(`${index} = ${snap.docs[0].data().text}`)
                last[index] = snap.docs[0].data().text || 'last msg';
                isFocused && setLastmsg(last)
                // chats[index]= {...chats[index],last:snap.docs[0].data().text}
                // setLastchat(prevState=>{
                //   return[...prevState,chats[index]]
                // })
                // console.log(chats[index]);
                // console.log(doc.data().chatid)
            });
        });
      });
      return ()=>{
          setChats([])
          setLastmsg([])
          setLastchat([])
      }
  }, []);

  console.log(lastchat)
  const deleteChat = id => {
    firestore().collection('users').doc(userdata?.UID).collection('chats').doc(id)
      .delete()
      .then(() => {
        alert('Chat deleted');
      })
      .catch(e => {
        alert('Something Went Wrong!');
      });
  };
  // console.log(lastmsg);

  const right = (id) =>{
    return(
    <TouchableOpacity onPress={()=>deleteChat(id)} style={{justifyContent:"center", paddingLeft:'10%', paddingRight:'10%', backgroundColor:'red'}}>
      <View >
        <Text>Archive</Text>
      </View>
    </TouchableOpacity>
      )
  }
  return (
    <>
      <FlatList
        data={lastchat}
        renderItem={({item, index}) => (
          <Swipeable renderRightActions={()=>right(item.id)}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Messages', {
                  id: item.id,
                  name: item.uname,
                  chatid: item.cid,
                })
              }
            >
                
                <View style={styles.container}>
                  <View style={{flexDirection: 'row'}}>
                    <Avatar.Text size={50} label={item.uname[0]} labelStyle={{fontWeight:'bold', color:'black'}}/>
                    <View>
                      <View style={styles.chatHeader}>
                        <Text style={styles.chatHeaderText}>{item.uname}</Text>
                      </View>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="middle"
                        style={{paddingLeft: 10, width: '60%'}}>
                        {item.last}
                      </Text>
                    </View>
                  </View>
                </View>
            </TouchableOpacity>
          </Swipeable> 
        )}
      />
    </>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor:'#c5c6d0'
  },
  chatHeader: {
    flexDirection: 'row',
    paddingLeft: 10,
    alignItems: 'center',
    width: '72%',
    justifyContent: 'space-between',
  },
  chatHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    width: '80%',
  },
});
