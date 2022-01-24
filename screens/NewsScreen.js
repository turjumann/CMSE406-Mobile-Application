import { StatusBar } from "expo-status-bar";
import React, { useLayoutEffect, useState } from "react";
import { ScrollView, SafeAreaView, StyleSheet, Text, View } from "react-native";

const NewsScreen = ({ navigation, route }) => {
  const { params } = route;

  console.log(params.item.title);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: params.item.title,
      headerBackTitle: "Home",
      headerTitleStyle: { color: "black" },
      headerStyle: { backgroundColor: "white" },
      headerTintColor: "black",
    });
  }, [navigation]);
  return (
    <ScrollView
      style={[
        styles.listContainer,
        { height: "100%", backgroundColor: "white" },
      ]}
    >
      <StatusBar style="dark" />
      <Text style={styles.listTitle}>{params.item.title}</Text>
      <Text style={styles.listBody}>{params.item.body}</Text>
      <Text style={styles.listAuthor} numberOfLines={1}>
        Author: {params.item.author}
      </Text>
    </ScrollView>
  );
};

export default NewsScreen;

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    width: "100%",
    height: "100%",
  },
  listTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "black",
    marginBottom: 18,
    alignSelf: "center",
  },
  listAuthor: {
    fontSize: 16,
    fontWeight: "300",
    color: "black",
    marginBottom: 18,
    alignSelf: "flex-start",
  },
  listBody: {
    fontSize: 15,
    fontWeight: "700",
    color: "black",
    marginBottom: 18,
    alignSelf: "flex-start",
  },
});
