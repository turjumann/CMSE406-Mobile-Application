import React, { useLayoutEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Button, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { db } from "../backend/firebase";
import CustomListItem from "../components/CustomListItem";

const AddChatScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "All Doctors",
      headerBackTitle: "Home",
      headerTitleStyle: { color: "black" },
      headerStyle: { backgroundColor: "white" },
      headerTintColor: "black",
    });
  }, [navigation]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ backgroundColor: "white" }}>
        <CustomListItem navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default AddChatScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 30,
    height: "100%",
  },
});
