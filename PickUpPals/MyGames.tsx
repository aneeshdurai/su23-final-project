import React, { memo, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
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
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore, collection, query, onSnapshot, orderBy, setDoc, doc, deleteDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getApp, initializeApp } from "firebase/app";
import { FlatList} from "react-native";
import { Card } from "react-native-paper";
import Logs from "./components/small_log";
import Navbar from "./Navbar";

const MyGames = ({navigation}) => {

    const navbarButtons = [
      { title: 'Home', screen: 'StartScreen' }
    ];
    const [name, setName] = useState({ value: "", error: "" });
    const [location, setLocation] = useState({ value: "", error: "" });
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const db = getFirestore();
    const gameCollection = collection(db, "games");
    const [games, setGames] = useState([]);
    const [showGames, setshowGames] = useState(false);
    
    useEffect(() => {
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
    }, []);

    const leave = async (game: Game) => {
        console.log(game.id);
        console.log(auth.currentUser);
        game.members.filter(e => e! = auth.currentUser.uid);
        console.log(game.members);
        await setDoc(doc(db, "games", game.id), game);
        
        console.log(game);
    }

    const renderGame = ({ item }: { item: Game }) => {
      console.log("Reached");
      if (item.members.includes(auth.currentUser.uid)) {
        return (
          <Card style={styles.card}>
            <Card.Title
              title={`${item.sport}`}
              subtitle={`${item.time} on ${item.date} at ${item.location}`}
            />
            <Card.Actions>
                <Button
                    mode="contained"
                    onPress={() => leave(item)}
                     style={styles.button}
                >
                Leave
                </Button>
            </Card.Actions>
          </Card>
        );
      }
    };


    return (
        <Background>
            <Navbar title = "Title" backButton buttons={navbarButtons} />
            <View style={{ position: 'absolute', top: 0, left: 0 }}>
            <Logs />
            </View>
            <Header> My Games </Header>
            { (
            <FlatList
                data={games}
                renderItem={renderGame}
                keyExtractor={(_: any, index: number) => "key-" + index}
                // removed 'position: absolute' and 'bottom: 0'
            />
            )}
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
    },card: {
      margin: 32,
      padding: 16,
      borderRadius: 12,
      elevation: 4
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    emptyText: {
      fontSize: 16,
      color: theme.colors.secondary
    }
  });

export default memo(MyGames);