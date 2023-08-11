import React, { memo, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from "react-native";
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
import { Card } from "react-native-paper";


const CreateGameScreen = ({navigation}) => {

    const [name, setName] = useState({ value: "", error: "" });
    const [time, setTime] = useState({ value: "", error: "" });
    const [date, setDate] = useState({ value: "", error: "" });
    const [people, setPeople] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState(null);


    const PersonDetailsModal = () => {
      return (
          <Modal
              animationType="slide"
              transparent={true}
              visible={!!selectedPerson}
              onRequestClose={() => setSelectedPerson(null)}
          >
              <TouchableOpacity 
                  style={styles.centeredView} 
                  activeOpacity={1} 
                  onPressOut={() => setSelectedPerson(null)}
              >
                  <View style={styles.modalView} onStartShouldSetResponder={() => true}>
                      <Text>Name: {selectedPerson?.name}</Text>
                      <Text>Location: {selectedPerson?.location}</Text>
                      <Text>Social Media Account: (place holder)</Text>
                      <Text>Phone Number: (place holder)</Text>
                      <TouchableOpacity onPress={() => navigation.navigate("ChatScreen")}>
                    <Text style={styles.link}>Message</Text>
                </TouchableOpacity>
                      <Button 
                          title="Close" 
                          onPress={() => setSelectedPerson(null)} 
                      />
                  </View>
              </TouchableOpacity>
          </Modal>
      );
  }
  
  
    
    const pseudoPeople = [
        { id: '1', name: 'Ben Bitdiddle', location: 'New York' },
        { id: '2', name: 'Aneesh Durai', location: 'Los Angeles' },
        { id: '3', name: 'Durai Aneesh', location: 'Chicago' },
        { id: '3', name: 'Durai Ben', location: 'Chicago' },
        { id: '3', name: 'Bitdiddle Bitdiddle', location: 'Chicago' },
        { id: '3', name: 'Ben Bitdiddle', location: 'Chicago' },
        { id: '3', name: 'Ben Bitdiddle', location: 'Chicago' },
        { id: '3', name: 'Ben Bitdiddle', location: 'Chicago' }
        // ... add as many people as you'd like
    ];
    useEffect(() => {
      setPeople(pseudoPeople);
  }, []);

  const renderPerson = ({ item }) => {
    return (
        <TouchableOpacity onPress={() => setSelectedPerson(item)}>
            <Card style={{ margin: 16 }}>
                <Card.Title
                    title={item.name}
                    subtitle={"From " + item.location}
                />
            </Card>
        </TouchableOpacity>
    );
};

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





            <View style={{ position: 'absolute', top: 0, left: 0 }}>
            <Logs />
            </View>
            <Header> My Community </Header>

            <FlatList
                data={people}
                renderItem={renderPerson}
                keyExtractor={item => item.id}
            />
        <PersonDetailsModal />

   
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
      }
  });

export default memo(CreateGameScreen);