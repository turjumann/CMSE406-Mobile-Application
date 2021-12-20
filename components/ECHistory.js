import React from "react";
import { StyleSheet, Text, View } from "react-native";
import ListItemSwipeable from "react-native-elements/dist/list/ListItemSwipeable";

const ECHistory = ({ card }) => {
  // console.log(card);
  return (
    <View style={[styles.listContainer, { backgroundColor: "#2D2D2D" }]}>
      <View>
        <Text style={styles.listTitle} numberOfLines={1}>
          Probability: {card.item?.probability}%
        </Text>
        <Text
          style={{
            color: "white",
            alignSelf: "flex-start",
            margin: 8,
            fontWeight: "bold",
            fontStyle: "italic",
          }}
        >
          Symptoms:
        </Text>
        <View>
          <View style={{ alignItems: "left" }}>
            <Text style={{ color: "white" }}>
              {card.item?.lossOfST ? "    Loss of Smell and Taste \n" : ""}
              {card.item?.fever ? "    Fever \n" : ""}
              {card.item?.cough ? "    Persistent Cough \n" : ""}
              {card.item?.fatigue ? "    Fatigue \n" : ""}
              {card.item?.diarrhea ? "    Diarrhea \n" : ""}
              {card.item?.abdominalPain ? "    Abdominal Pain \n" : ""}
              {card.item?.meals ? "    Skipping Meals \n" : ""}
            </Text>
            <Text style={{ color: "white" }}></Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ECHistory;

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginHorizontal: 12,
    width: 200,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "white",
    marginBottom: 18,
    alignSelf: "center",
  },
});
