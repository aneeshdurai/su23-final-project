import React, { memo, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
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


const CreateGameScreen = ({navigation}) => {

    const [name, setName] = useState({ value: "", error: "" });
    const [successModalVisible, setSuccessModalVisible] = useState(false);

    const [time, setTime] = useState({ value: "", error: "" });
    const [date, setDate] = useState({ value: "", error: "" });
    const [location, setLocation] = useState({ value: "", error: "" });
    const [modalVisible, setModalVisible] = useState(false);
    const [members, setMembers] = useState([]);
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
            setSuccessModalVisible(true);
        }
        catch (e) {
            console.log("Error while writing request:", e);
        }
    }
    
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

<Modal
    transparent={true}
    visible={successModalVisible}
    onRequestClose={() => {
        setSuccessModalVisible(false);
    }}
>
    <View style={styles.centering}>
        <View style={styles.modalViews}>
            <Text style={styles.modalText}>Successful</Text>
            <TouchableOpacity
                style={{ ...styles.modalbutton, ...styles.buttonClose }}
                onPress={() => setSuccessModalVisible(false)}
            >
                <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
        </View>
    </View>
</Modal>


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
                  <TouchableOpacity onPress={() => navigation.navigate("MyGames")}>
                    <Text style={styles.link}>My Games</Text>
                </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate("MyCommunity")}>
                    <Text style={styles.link}>My Community</Text>
                </TouchableOpacity>
                  <Text style={styles.modalText}>My Settings</Text>
                  <Text style={styles.modalText}>Log Out</Text>
                  {/* Add more options here */}
              </View>
          </TouchableOpacity>
      </Modal>





            <View style={{ position: 'absolute', top: 0, left: 0 }}>
            <Logs />
            </View>
            <Header> Welcome! </Header>
            <TextInput
                label="Sport"
                returnKeyType="next"
                value={name.value}
                onChangeText={text => setName({ value: text, error: "" })}
                error={!!name.error}
                errorText={name.error}
            />
            <TextInput
                label="Time"
                returnKeyType="next"
                value={time.value}
                onChangeText={text => setTime({ value: text, error: "" })}
                error={!!time.error}
                errorText={time.error}
            />
            <TextInput
                label="Date"
                returnKeyType="next"
                value={date.value}
                onChangeText={text => setDate({ value: text, error: "" })}
                error={!!date.error}
                errorText={date.error}
            />
            <TextInput
                label="Location"
                returnKeyType="next"
                value={location.value}
                onChangeText={text => setLocation({ value: text, error: "" })}
                error={!!location.error}
                errorText={location.error}
            />
            <Button
                mode="contained"
                onPress={() => create()}
                style={styles.button}
            >
                Create Game
            </Button>

            
            
            <View style={styles.row}>
                <TouchableOpacity onPress={() => navigation.navigate("SearchGameScreen")}>
                    <Text style={styles.link}>Join A Game</Text>
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
      },centering: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },modalViews: {
      width: 150,    // Set to your desired width
      height: 150,   // Set to your desired height
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
  }
  
  });

export default memo(CreateGameScreen);