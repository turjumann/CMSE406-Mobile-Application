import React, { useLayoutEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Button, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { db } from "../backend/firebase";
import CustomListItemDocs from "../components/CustomListItemDocs";

const AddChatScreenDocs = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Patients",
      headerBackTitle: "Home",
      headerTitleStyle: { color: "black" },
      headerStyle: { backgroundColor: "white" },
      headerTintColor: "black",
    });
  }, [navigation]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ backgroundColor: "white" }}>
        <CustomListItemDocs navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default AddChatScreenDocs;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 30,
    height: "100%",
  },
});
