import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import NewsScreen from "../screens/NewsScreen";

const NewsHistory = ({ news, navigation }) => {
  return (
    <View style={[styles.listContainer, { backgroundColor: "#2D2D2D" }]}>
      <View>
        <Text style={styles.listTitle} numberOfLines={1}>
          Author: {news.item.author}
        </Text>
        <Text style={styles.listTitle} numberOfLines={1}>
          Title: {news.item.title}
        </Text>
        <Text style={styles.listBody} numberOfLines={4}>
          Body: {news.item.body}
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("NewsScreen", news)}
          style={{ alignSelf: "flex-end", marginRight: 15 }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 15,
              height: 25,
              width: 100,
            }}
          >
            <Text style={{ color: "black" }}>Read More..</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NewsHistory;

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginHorizontal: 12,
    width: 300,
    height: "100%",
  },
  listTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "white",
    marginBottom: 18,
    alignSelf: "flex-start",
  },
  listBody: {
    fontSize: 15,
    fontWeight: "700",
    color: "white",
    marginBottom: 18,
    alignSelf: "flex-start",
  },
});
