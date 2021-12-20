import React, { useEffect, useLayoutEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, FlatList } from "react-native";

import { db } from "../backend/firebase";
import { StatusBar } from "expo-status-bar";
import ECHistory from "../components/ECHistory";

const DocECScreen = ({ route, navigation }) => {
  const { params } = route;
  const { guestName, guestSurname, guestId } = params;
  const [cards, setCards] = useState([]);

  const getCards = async () => {
    console.log("getCards is called");
    const cardsz = await db
      .collection("EC-Forms")
      .doc(guestId)
      .collection("EC-History")
      .orderBy("id")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((snapshot) => {
          setCards((cards) => [...cards, snapshot.data()]);
        });
      });
  };

  useEffect(() => {
    console.log("Im calling btch");
    setCards([]);
    getCards();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Patient Cards",
      headerStyle: { backgroundColor: "white" },
      headerTitleStyle: { color: "black" },
      headerTintIcon: "black",
      headerBackTitle: "Back",
      headerTintColor: "#222222",
    });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <SafeAreaView>
        <StatusBar style="dark" />
        <Text
          style={{
            marginBottom: 7,
            marginTop: 7,
            fontFamily: "Avenir",
            fontWeight: "bold",
            fontSize: 20,
            alignSelf: "center",
          }}
        >
          Examination Card History
        </Text>
        <FlatList
          removeClippedSubviews
          data={cards}
          keyExtractor={(item) => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => <ECHistory card={{ item }} />}
        />
      </SafeAreaView>
    </View>
  );
};

export default DocECScreen;

const styles = StyleSheet.create({});
