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
import TextDropdown from "./components/TextDropdown";
import { Picker } from "@react-native-picker/picker";


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

   
    const capitalizeFirstLetter = (text) => {
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }; 

    const asyncAwaitNetworkRequests = async () => {
        const db = getFirestore();
        const requestCollection = collection(db, "games");
        const requestRef = doc(requestCollection);
        const storage = getStorage(getApp());
        const creatorName = currentUser.email; 
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
    
    const isValidDate = (date) => {
      const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d{2}$/;
      return regex.test(date);

    
    };
    
    const checkDate = (text) => {
      if (isValidDate(text)) {
        setDate({ value: text, error: "" });
      } 

      else {
         setDate({ value: text, error: "Please Format Date As: (MM/DD/YYYY)" });
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

<Modal
    transparent={true}
    visible={successModalVisible}
    onRequestClose={() => {
        setSuccessModalVisible(false);
    }}
>
    <View style={styles.centering}>
        <View style={styles.modalViews}>
            <Text style={styles.modalText}>Game Created</Text>
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
                onChangeText={text => setName({ value: capitalizeFirstLetter(text), error: "" })}
                error={!!name.error}
                errorText={name.error}
            />
            <Picker
              selectedValue={time.value}
              onValueChange={(text) => setTime({ value: text, error: "" })}
              style={styles.picker_2}
            >
              <Picker.Item label="Time" value="" />
              <Picker.Item label="12:00 AM PST" value="12:00 AM PST" />
              <Picker.Item label="01:00 AM PST" value="01:00 AM PST" />
              <Picker.Item label="02:00 AM PST" value="02:00 AM PST" />
              <Picker.Item label="03:00 AM PST" value="03:00 AM PST" />
              <Picker.Item label="04:00 AM PST" value="04:00 AM PST" />
              <Picker.Item label="05:00 AM PST" value="05:00 AM PST" />
              <Picker.Item label="06:00 AM PST" value="06:00 AM PST" />
              <Picker.Item label="07:00 AM PST" value="07:00 AM PST" />
              <Picker.Item label="09:00 AM PST" value="09:00 AM PST" />
              <Picker.Item label="10:00 AM PST" value="10:00 AM PST" />
              <Picker.Item label="11:00 AM PST" value="11:00 AM PST" />
              <Picker.Item label="12:00 PM PST" value="12:00 PM PST" />
              <Picker.Item label="01:00 PM PST" value="01:00 PM PST" />
              <Picker.Item label="02:00 PM PST" value="02:00 PM PST" />
              <Picker.Item label="03:00 PM PST" value="03:00 PM PST" />
              <Picker.Item label="04:00 PM PST" value="04:00 PM PST" />
              <Picker.Item label="05:00 PM PST" value="05:00 PM PST" />
              <Picker.Item label="06:00 PM PST" value="06:00 PM PST" />
              <Picker.Item label="07:00 PM PST" value="07:00 PM PST" />
              <Picker.Item label="08:00 PM PST" value="08:00 PM PST" />
              <Picker.Item label="09:00 PM PST" value="09:00 PM PST" />
              <Picker.Item label="10:00 PM PST" value="10:00 PM PST" />
              <Picker.Item label="11:00 PM PST" value="11:00 PM PST" />
            </Picker>
            <TextInput
                label="Date (MM/DD/YYYY)"
                returnKeyType="next"
                value={date.value}
                onChangeText={text => checkDate(text)}
                error={!!date.error}
                errorText={date.error}
            />
            <TextInput
                label="Location"
                returnKeyType="next"
                value={location.value}
                onChangeText={text => setLocation({ value: capitalizeFirstLetter(text), error: "" })}
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
  },picker_2: {
    height: 50,
    width: '100%',
    color: '#666666',
    marginBottom: 10, // adjust margin as needed
    backgroundColor: '#ffffff',
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 3,
  },
  
  });

export default memo(CreateGameScreen);