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

const HomeScreen = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [cards, setCards] = useState([]);
  const [onRender, setOnRender] = useState(0);

  getCurrentUser = () => {
    return auth.currentUser;
  };

  const getCards = async () => {
    const cards = await db
      .collection("EC-Forms")
      .doc(getCurrentUser().uid)
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
    setCards([]);
    getCards();
  }, [onRender]);

  //Sign out method. When called, it returns the user to the login screen
  const signOutUser = () => {
    auth.signOut().then(() => {
      navigation.replace("Login");
    });
  };

  const onSubmit = (card) => {
    //setCards((cards) => [...cards, card]);
    setModalVisible(!modalVisible);
    setOnRender(onRender + 1);
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
            width: 60,
            marginRight: 20,
          }}
        >
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <FontAwesome5 name="virus" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("AddChat");
            }}
          >
            <Icon name="user-md" type="antdesign" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);

  const enterChat = (id, chatName) => {
    navigation.navigate("Chat", {
      id,
      chatName,
    });
  };

  const onClose = () => {
    setModalVisible(!modalVisible);
  };

  //Renders the components
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <SafeAreaView>
        <StatusBar style="dark" />
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Pressable
                style={{
                  alignSelf: "flex-end",
                  position: "absolute",
                  padding: 15,
                }}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <FontAwesome5 name="times-circle" size={30} color="black" />
              </Pressable>
              <View style={{ flex: 1 }}>
                {/*Flexing the contents inside modal */}
                <ECForm onSubmit={onSubmit} />
              </View>
            </View>
          </View>
        </Modal>
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

export default HomeScreen;

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
