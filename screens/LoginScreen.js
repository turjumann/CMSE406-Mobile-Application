import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Button, Input, Image } from "react-native-elements";
import { auth, db } from "../backend/firebase";
//Importing Firebase here <<

const LoginScreen = ({ navigation }) => {
  //Getting the values of input fields
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [userProfile, setUserProfile] = useState();
  const [currentUser, setCurrentUser] = useState();

  // Checking if there is a logged in user. If yes, it returns to the home screen
  useEffect(() => {
    const unsubscribed = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        const currId = authUser.uid;
        console.log(currId);
        db.collection("allUsers")
          .doc(currId)
          .get()
          .then((querySnapshot) => {
            let newData = {
              id: querySnapshot.id,
              name: querySnapshot.data().name,
              surname: querySnapshot.data().surname,
              age: querySnapshot.data().age,
              sex: querySnapshot.data().sex,
              profilePhoto: querySnapshot.data().profilePhotoUrl,
            };
            if (newData?.age === undefined) {
              navigation.replace(
                "HomeDocs",
                querySnapshot.data().profilePhotoUrl
              );
              console.log("from doctor");
            } else {
              navigation.replace("Home", querySnapshot.data().profilePhotoUrl);
              console.log("from patient");
            }
          });
      } else {
        console.log("Off");
      }
    });
    return unsubscribed;
  }, []);

  //Sign in method
  const signIn = ({ navigation }) => {
    if (email && password) {
      auth.signInWithEmailAndPassword(email, password).catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        if (
          errorCode === "auth/wrong-password" ||
          errorCode === "auth/user-not-found" ||
          errorCode === "auth/user-disable"
        ) {
          alert("Wrong email or password");
        } else if (errorCode === "auth/invalid-email") {
          alert("Invalid email");
        } else {
          alert(errorMessage);
        }
      });
    } else {
      alert("Email / Password cannot be empty");
    }
  };

  //Rendering the screen components
  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="dark" />
      <Image
        source={{
          uri: "https://vanguardmedgroup.com/wp-content/uploads/2020/03/covid19.png",
        }}
        style={{ width: 200, height: 200 }}
      />

      <View style={styles.inputContainer}>
        <Input
          placeholder="Email"
          autoFocus
          type="email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          placeholder="Password"
          type="password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
          onSubmitEditing={signIn}
        />
      </View>
      <Button containerStyle={styles.button} onPress={signIn} title="Login" />
      <Button
        onPress={() => navigation.navigate("Register")}
        containerStyle={styles.button}
        type="outline"
        title="Sign Up"
      />
      <View style={{ height: 100 }} />
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

//Styles for components rendered to screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "white",
  },
  inputContainer: {
    width: 300,
  },
  button: {
    width: 200,
    marginTop: 10,
  },
});
