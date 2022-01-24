import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { ListItem, Avatar, Icon } from "react-native-elements";
import { auth, db } from "../backend/firebase";

import styled from "styled-components";
import MessageScreen from "../screens/MessageScreen";
import Text from "../components/Text";
import "firebase/auth";
import "firebase/firestore";
import { Alert } from "react-native";

getUserInfo = async (uid) => {
  try {
    const user = await db.collection("allUsers").doc(uid).get();
    if (user.exists) {
      return user.data();
    }
  } catch (error) {
    console.log("Error @getUserInfo", error);
  }
};

export default CustomListItem = ({ navigation }) => {
  getCurrentUser = () => {
    return auth.currentUser;
  };

  getRegisteredUsers = async () => {
    const currId = getCurrentUser().uid;
    return await db
      .collection("doctors")
      .orderBy("email", "desc")
      .get()
      .then((querySnapshot) => {
        let arr = [];

        querySnapshot.forEach((documentSnapshot) => {
          let newData = {
            id: documentSnapshot.id,
            name: documentSnapshot.data().name,
            surname: documentSnapshot.data().surname,
            hospital: documentSnapshot.data().hospital,
            profilePhoto: documentSnapshot.data().profilePhotoUrl,
          };
          if (newData.id === currId) {
          } else {
            arr = [...arr, newData];
          }
        });
        return arr;
      });
  };

  const [chats, setChats] = useState([]);
  const [currId, setCurrId] = useState();
  const [currName, setCurrName] = useState();
  const [currProfilePhoto, setCurrProfilePhoto] = useState();
  const [guestProfilePhoto, setGuestProfilePhoto] = useState();

  const waitForIt = async () => {
    let ex = await getRegisteredUsers();
    let uuid = await getCurrentUser().uid;
    let currUser = await getUserInfo(uuid);
    setChats(ex);

    setCurrId(uuid);
    setCurrName(currUser.name);
    setCurrProfilePhoto(currUser.profilePhotoUrl);
    setGuestProfilePhoto(ex.profilePhoto);
  };

  useEffect(() => {
    waitForIt();
  }, []);

  const onTap = (guestId, guestName, guestSurname) => {
    navigation.navigate("Message", {
      guestName,
      guestSurname,
      guestId,
      currentUserID: currId,
    });
  };

  return (
    <ScrollView style={{ height: "100%", backgroundColor: "white" }}>
      <View style={{ height: 10 }} />
      {chats.map((item, i) => (
        <ListItem
          key={i}
          bottomDivider
          onPress={() => onTap(item.id, item.name, item.surname)}
        >
          <Avatar
            rounded
            size="small"
            source={{
              uri:
                item.profilePhoto === "default"
                  ? "https://firebasestorage.googleapis.com/v0/b/cmse322.appspot.com/o/profilePhotos%2FFW6FissAKyRAMy80YZvyIm0lJbt2?alt=media&token=36a87151-298a-4d54-a447-869158e43ede"
                  : item.profilePhoto,
            }}
          />
          <ListItem.Content>
            <ListItem.Title
              style={{ color: "#414959", fontWeight: "400", fontSize: 20 }}
            >
              {item.name} {item.surname}
            </ListItem.Title>
            <ListItem.Subtitle
              style={{ color: "#ad1c45", fontWeight: "300", fontSize: 15 }}
            >
              {item.hospital}
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      ))}
    </ScrollView>
  );
};

const Container = styled.View``;

const ProfilePhotoContainer = styled.View`
  shadow-opacity: 0.5;
  shadow-radius: 30px;
  shadow-color: #222222;
  align-items: center;
  margin-top: 30px;
  marginright: auto;
`;

const ProfilePhoto = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 64px;
  marginleft: auto;
`;
