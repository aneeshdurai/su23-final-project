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

const SearchGameScreen = ({navigation}) => {

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

    const join = async (game: Game) => {
        console.log(game.id);
        console.log(auth.currentUser);
        game.members.push(auth.currentUser.uid);
        console.log(game.members);
        await setDoc(doc(db, "games", game.id), game);
        
        console.log(game);
    }

    const renderGame = ({ item }: { item: Game }) => {
      console.log("Reached");
      if ((name.value.toLowerCase()) == (item.sport.toLowerCase()) && (item.location.toLowerCase()).includes(location.value.toLowerCase())) {
        return (
          <Card style={styles.card}>
            <Card.Title
              title={`${item.sport} at ${item.location}`}
              subtitle={`${item.time} on ${item.date}.`}
            />
            <Card.Actions>
                <Button
                    mode="contained"
                    onPress={() => join(item)}
                     style={styles.button}
                >
                Join
                </Button>
            </Card.Actions>
          </Card>
        );
      }
    };

    const find = () => {
        setshowGames(true);
        
    }

    const capitalizeFirstLetter = (text) => {
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }; 

    return (
        <Background>
            <View style={{ position: 'absolute', top: 0, left: 0 }}>
            <Logs />
            </View>
            <Header> Join A Game </Header>
            <TextInput
                label="Enter Sport"
                returnKeyType="next"
                value={name.value}
                onChangeText={text => setName({ value: capitalizeFirstLetter(text), error: "" })}
                error={!!name.error}
                errorText={name.error}
            />
            <TextInput
                label="Location (City Name)"
                returnKeyType="next"
                value={location.value}
                onChangeText={text => setLocation({ value: capitalizeFirstLetter(text), error: "" })}
                error={!!location.error}
                errorText={location.error}
            />
            <Button
                mode="contained"
                onPress={find}
                style={styles.button}
            >
                Find Games
            </Button>
            {showGames && (
            <FlatList
                data={games}
                renderItem={renderGame}
                keyExtractor={(_: any, index: number) => "key-" + index}
                // removed 'position: absolute' and 'bottom: 0'
            />
            )}
            {!showGames && (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No {name.value} Games In Your Location</Text>
                </View>
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

export default memo(SearchGameScreen);