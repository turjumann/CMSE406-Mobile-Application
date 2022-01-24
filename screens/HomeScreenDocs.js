import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Alert,
  Modal,
  Stylesheet,
  Text,
  Pressable,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
} from "react-native";

import { Avatar } from "react-native-elements";
import { auth, db } from "../backend/firebase";
import { FontAwesome5 } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome";
import { StatusBar } from "expo-status-bar";
import ECForm from "../components/ECForm";
import { ListItem } from "react-native-elements";
import ECHistory from "../components/ECHistory";
import NewsHistory from "../components/NewsHistory";

const HomeScreenDocs = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [cards, setCards] = useState([]);
  const [news, setNews] = useState([]);

  const getNewsIds = async () => {
    const snapshot = await db
      .collection("news")
      .orderBy("time", "desc")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((snapshot) => {
          setNews((news) => [...news, snapshot.data()]);
        });
      });
  };

  useEffect(() => {
    setTimeout(() => {
      setNews([]);
      getNewsIds();
    }, 500);
  }, []);

  getCurrentUser = () => {
    return auth.currentUser;
  };

  //Sign out method. When called, it returns the user to the login screen
  const signOutUser = () => {
    auth.signOut().then(() => {
      navigation.replace("Login");
    });
  };

  const onSubmit = (card) => {
    setCards((cards) => [...cards, card]);
    setModalVisible(!modalVisible);
  };
  //Altering the top bar title, icons, and style.
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Home",
      headerStyle: { backgroundColor: "white" },
      headerTitleStyle: { color: "black" },
      headerTintIcon: "black",
      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          <TouchableOpacity onPress={signOutUser}>
            <Avatar rounded size="small" source={{ uri: route.params }} />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 30,
            marginRight: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("AddChatDocs");
            }}
          >
            <Icon name="users" type="antdesign" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);

  return (
    <ScrollView style={{ backgroundColor: "white" }}>
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
        News
      </Text>
      <FlatList
        style={{ alignSelf: "center" }}
        removeClippedSubviews
        data={news}
        keyExtractor={(item) => item.time.seconds}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <NewsHistory navigation={navigation} news={{ item }} />
        )}
      />
    </ScrollView>
  );
};

export default HomeScreenDocs;

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "transparent",
  },
  modalView: {
    height: "73%",
    width: "80%",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
