import React, { memo, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal ,Image} from "react-native";
import Background from "./components/Background";
import Logo from "./components/Logo";
import Header from "./components/Header";
import Button from "./components/Button";
import TextInput from "./components/TextInput";
import BackButton from "./components/BackButton";
import { theme } from "./core/theme";
import Toast from "./components/Toast";
import firebase from "firebase/app";
import { Game } from "./game";
import { getAuth, createUserWithEmailAndPassword, updateProfile, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, query, onSnapshot, orderBy, setDoc, doc, deleteDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getApp, initializeApp } from "firebase/app";
import Logs from "./components/small_log";
import { ScrollView } from 'react-native';
import ChatSendButton from "./components/ChatSendButton";



const CreateGameScreen = ({navigation}) => {

    const [name, setName] = useState({ value: "", error: "" });
    const [time, setTime] = useState({ value: "", error: "" });
    const [date, setDate] = useState({ value: "", error: "" });
    const [currentMessage, setCurrentMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [location, setLocation] = useState({ value: "", error: "" });
    const [modalVisible, setModalVisible] = useState(false);
    const [members, setMembers] = useState([]);
    const [responseIndex, setResponseIndex] = useState(0);
    const predefinedResponses = [
      "Totally, I’ve played my whole life and love meeting new ballers. Want to watch the world cup finals tmr?",
      "I'm down?",
      "I'll get back to you shortly.",
      "Noted.",
      "Sorry, I didn't understand that."
  ];
  
  
    const auth = getAuth();
    const [currentUser, setCurrentUser] = useState(null);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
        });

        return unsubscribe;
    }, []);


    const db = getFirestore();
    //const gameCollection = collection(db, "games");
    const [games, setGames] = useState([]);

    const asyncAwaitNetworkRequests = async () => {
        const db = getFirestore();
        const requestCollection = collection(db, "games");
        const requestRef = doc(requestCollection);
        const storage = getStorage(getApp());
        const creatorName = currentUser.displayName; 
        console.log(currentUser);
        const request: Game = {
            sport: name.value,
            creator: creatorName,
            time: time.value,
            date: date.value,
            location: location.value,
            members: [currentUser.uid]

        };
        console.log(members)
        await setDoc(requestRef, request);
        console.log("Added Ticket");
      };

    const create = () => {
        try {
            asyncAwaitNetworkRequests()
        }
        catch (e) {
            console.log("Error while writing request:", e);
        }
    }
    const handleSendMessage = () => {
      if (currentMessage.trim() !== '') {
          setChatHistory(prevChat => [...prevChat, { sender: currentUser.displayName, message: currentMessage.trim() }]);
          setCurrentMessage(''); // Clear the input after sending
          
          // Automated reply after 2 seconds
          setTimeout(() => {
              const reply = predefinedResponses[responseIndex];
              setChatHistory(prevChat => [...prevChat, { sender: 'Ben', message: reply }]);
              
              // Update the responseIndex
              setResponseIndex((prevIndex) => (prevIndex + 1) % predefinedResponses.length);
          }, 2000);
      }
  };
    
    /*useEffect(() => {
        const unsubscribe = onSnapshot(query(gameCollection, orderBy("creator")), (querySnapshot) => {
        var newGames: Game[] = [];
            querySnapshot.forEach((game) => {
              const newGame = game.data() as Game;
              newGame.id = game.id;
              newGames.push(newGame);
            });
            //console.log(newTickets);
            setGames(newGames);
        });
        return unsubscribe;
    }, []);*/


    return (
        <Background>

<View style={styles.hamburgerContainer}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.hamburger}>☰</Text>
          </TouchableOpacity>
      </View>

      <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
      >
          <TouchableOpacity 
              style={styles.centeredView} 
              activeOpacity={1} 
              onPressOut={() => setModalVisible(false)}
          >
              <View style={styles.modalView} onStartShouldSetResponder={() => true}>
                  <Text style={styles.modalText}>My Profile</Text>
                  <Text style={styles.modalText}>My Games</Text>
                  <TouchableOpacity onPress={() => navigation.navigate("MyCommunity")}>
                    <Text style={styles.link}>My Community</Text>
                </TouchableOpacity>
                  <Text style={styles.modalText}>My Settings</Text>
                  <Text style={styles.modalText}>Log Out</Text>
                  {/* Add more options here */}
              </View>
          </TouchableOpacity>
      </Modal>





 
            <Header> Ben Bitdiddle </Header>
            <TouchableOpacity style={styles.translateButton} onPress={() => { /* Add your translation logic here */ }}>
    <Text style={styles.translateButtonText}>Click to translate text</Text>
</TouchableOpacity>

            {/* Render chat history */}
            <ScrollView style={{ height: '60%', margin: 10 }}>
                {chatHistory.map((chat, index) => (
                    <View key={index} style={{ padding: 5, backgroundColor: currentUser.displayName === chat.sender ? 'lightblue' : 'lightgray', borderRadius: 5, margin: 5 }}>
                        <Text><Text style={{ fontWeight: 'bold' }}>{chat.sender}:</Text> {chat.message}</Text>
                    </View>
                ))}
            </ScrollView>

            {/* Message Input */}
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
    <TextInput
        value={currentMessage}
        onChangeText={setCurrentMessage}
        placeholder="Type your message..."
        style={{ flex: 1, marginRight: 10 }}  // Add marginRight for spacing between input and button
    />
    <TouchableOpacity onPress={handleSendMessage}>
    <Image 
        source={require('./assets/fullsend.png')} // replace 'path-to-your-send-icon.png' with your image path
        style={{ width: 30, height: 30 }} // adjust the width and height as per your needs
    />
</TouchableOpacity>
</View>
            

     
        </Background>

    )
}

const styles = StyleSheet.create({
    label: {
      color: theme.colors.secondary
    },
    button: {
      marginTop: 24
    },
    row: {
      flexDirection: "row",
      marginTop: 4
    },
    link: {
      fontWeight: "bold",
      color: theme.colors.primary
    },hamburgerContainer: {
        position: 'absolute',
        top: 20, // adjust this as needed
        right: 20, // adjust this as needed
      },
      hamburger: {
        fontSize: 30, // adjust this as needed
      },
      centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-end",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '50%',
        height: '100%', // Full height
      },
      modalbutton: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
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
        marginBottom: 15,
        textAlign: "center"
      },messageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
    },translateButton: {
      alignSelf: 'flex-end',
      padding: 8,
      borderRadius: 5,
      borderColor: theme.colors.primary,
      borderWidth: 1,
      marginTop: 5,  // Add a margin to separate it from the header
      marginRight: 20 // Right margin for positioning
  },
  translateButtonText: {
      color: theme.colors.primary,
      fontSize: 14
  }
  
  });

export default memo(CreateGameScreen);