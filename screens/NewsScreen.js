import { StatusBar } from "expo-status-bar";
import React, { useLayoutEffect, useState } from "react";
import { ScrollView, SafeAreaView, StyleSheet, Text, View } from "react-native";

const NewsScreen = ({ navigation, route }) => {
  const { params } = route;
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
    <ScrollView style={[styles.listContainer, { backgroundColor: "#fff" }]}>
      <StatusBar style="dark" />
      <Text style={styles.listTitle}>{params.item.title}</Text>
      <Text style={styles.listBody}>{params.item.body}</Text>
      <Text style={{ fontStyle: "italic", alignSelf: "flex-start" }}>
        Date: {params.item.time.toDate().toString().slice(0, 24)}
      </Text>
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
  },
  listTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2D2D2D",
    marginBottom: 18,
    alignSelf: "center",
  },
  listAuthor: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2D2D2D",
    marginBottom: 18,
    marginTop: 12,
    fontStyle: "italic",
    alignSelf: "flex-start",
  },
  listBody: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2D2D2D",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
});
