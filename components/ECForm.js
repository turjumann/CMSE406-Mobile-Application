import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, CheckBox } from "react-native-elements";
import { auth, db } from "../backend/firebase";

const ECForm = (props) => {
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [check3, setCheck3] = useState(false);
  const [check4, setCheck4] = useState(false);
  const [check5, setCheck5] = useState(false);
  const [check6, setCheck6] = useState(false);
  const [check7, setCheck7] = useState(false);

  const [examinationCard, setExaminationCard] = useState({
    id: new Date(),
    age: 23,
    sex: 1,
    lossOfST: 0,
    fever: 0,
    cough: 0,
    fatigue: 0,
    diarrhea: 0,
    meals: 0,
    abdominalPain: 0,
    probability: 0,
  });

  getCurrentUser = () => {
    return auth.currentUser;
  };

  const createUserEC = async () => {
    const uid = getCurrentUser().uid;
    try {
      await db
        .collection("EC-Forms")
        .doc(uid)
        .set({ updatedAt: new Date() }, { merge: true });
      await db.collection("EC-Forms").doc(uid).collection("EC-History").add({
        id: examinationCard.id,
        age: examinationCard.age,
        sex: examinationCard.sex,
        lossOfST: examinationCard.lossOfST,
        fever: examinationCard.fever,
        cough: examinationCard.cough,
        fatigue: examinationCard.fatigue,
        diarrhea: examinationCard.diarrhea,
        meals: examinationCard.meals,
        abdominalPain: examinationCard.abdominalPain,
        probability: examinationCard.probability,
        userEmail: getCurrentUser().email,
      });
    } catch (e) {
      Alert.alert(e.message);
      console.log("Error @createUserEC: ", e.message);
    }
  };

  //const [x, setX] = useState(false);

  useEffect(() => {
    if (examinationCard.probability) {
      const unsubscribe = props.onSubmit(examinationCard);
      console.log("inside useEffect: ", examinationCard.probability);
      createUserEC();
      return unsubscribe;
    }
  }, [examinationCard.probability]);
  
  const calculations = () => {
    const preResult =
      -2.3 +
      0.01 * examinationCard.age -
      0.24 * examinationCard.sex +
      1.6 * examinationCard.lossOfST +
      0.76 * examinationCard.fever +
      0.33 * examinationCard.cough +
      0.25 * examinationCard.fatigue +
      0.31 * examinationCard.diarrhea +
      0.46 * examinationCard.meals -
      0.48 * examinationCard.abdominalPain;

    const expOfX = Math.pow(Math.E, preResult);
    const postResult = expOfX / (1 + expOfX);
    setExaminationCard({
      ...examinationCard,
      probability: (postResult * 100).toFixed(),
    });
  };

  const onSubmition = () => {
    calculations();
    // setX((prevX) => prevX + 1);
  };

  return (
    <View style={{ flex: 1 }}>
      <Text
        style={{
          marginBottom: 7,
          fontFamily: "Avenir",
          fontWeight: "bold",
          fontSize: 20,
          alignSelf: "center",
          padding: 10,
        }}
      >
        Examination Card
      </Text>
      <ScrollView persistentScrollbar={true}>
        <CheckBox
          title="Loss of Smell and Taste"
          checkedColor="black"
          onPress={() => {
            check1
              ? setExaminationCard({ ...examinationCard, lossOfST: 0 })
              : setExaminationCard({ ...examinationCard, lossOfST: 1 });
            setCheck1(!check1);
          }}
          checked={check1}
        />
        <CheckBox
          title="Fever"
          checkedColor="black"
          onPress={() => {
            check2
              ? setExaminationCard({ ...examinationCard, fever: 0 })
              : setExaminationCard({ ...examinationCard, fever: 1 });
            setCheck2(!check2);
          }}
          checked={check2}
        />
        <CheckBox
          title="Persistent Cough"
          checkedColor="black"
          onPress={() => {
            check3
              ? setExaminationCard({ ...examinationCard, cough: 0 })
              : setExaminationCard({ ...examinationCard, cough: 1 });
            setCheck3(!check3);
          }}
          checked={check3}
        />
        <CheckBox
          title="Fatigue"
          checkedColor="black"
          onPress={() => {
            check4
              ? setExaminationCard({ ...examinationCard, fatigue: 0 })
              : setExaminationCard({ ...examinationCard, fatigue: 1 });
            setCheck4(!check4);
          }}
          checked={check4}
        />
        <CheckBox
          title="Diarrhea"
          checkedColor="black"
          onPress={() => {
            check5
              ? setExaminationCard({ ...examinationCard, diarrhea: 0 })
              : setExaminationCard({ ...examinationCard, diarrhea: 1 });
            setCheck5(!check5);
          }}
          checked={check5}
        />
        <CheckBox
          title="Abdominal Pain"
          checkedColor="black"
          onPress={() => {
            check6
              ? setExaminationCard({ ...examinationCard, abdominalPain: 0 })
              : setExaminationCard({ ...examinationCard, abdominalPain: 1 });
            setCheck6(!check6);
          }}
          checked={check6}
        />
        <CheckBox
          title="Skipping Meals"
          checkedColor="black"
          onPress={() => {
            check7
              ? setExaminationCard({ ...examinationCard, meals: 0 })
              : setExaminationCard({ ...examinationCard, meals: 1 });
            setCheck7(!check7);
          }}
          checked={check7}
        />
      </ScrollView>
      <View>
        <Button
          title="Submit"
          titleStyle={{ color: "white" }}
          disabled={
            !check1 &&
            !check2 &&
            !check3 &&
            !check4 &&
            !check5 &&
            !check6 &&
            !check7
          }
          onPress={onSubmition}
          buttonStyle={styles.button}
          type="solid"
        />
      </View>
    </View>
  );
};

export default ECForm;

const styles = StyleSheet.create({
  input: {
    marginBottom: 10,
    borderBottomWidth: 2,
    width: 92,
  },
  button: {
    borderRadius: 15,
    padding: 10,
    width: "50%",
    alignSelf: "flex-end",
    marginTop: 20,
    backgroundColor: "black",
    borderColor: "black",
  },
});
