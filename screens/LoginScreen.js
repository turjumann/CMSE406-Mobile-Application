import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Button, Input, Image } from "react-native-elements";
import { auth, db } from "../backend/firebase";
import Text from "../components/Text";

import styled from "styled-components";
import { ScrollView } from "react-native-gesture-handler";
//Importing Firebase here <<

const LoginScreen = ({ navigation }) => {
  //Getting the values of input fields
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [userProfile, setUserProfile] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(false);

  const signOutUser = () => {
    auth.signOut();
  };

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
              approved: querySnapshot.data().approved,
            };
            if (newData?.age === undefined) {
              console.log(newData?.approved);
              if (newData?.approved == "0") {
                alert("The user is not approved by an admin yet..");
                console.log("Not approved");
                signOutUser();
              } else {
                navigation.replace(
                  "HomeDocs",
                  querySnapshot.data().profilePhotoUrl
                );
              }
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
    <Container>
      <StatusBar style="dark" />

      <View
        style={{
          height: 310,
          alignItems: "center",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <Image
          source={{
            uri: "https://vanguardmedgroup.com/wp-content/uploads/2020/03/covid19.png",
          }}
          style={{ width: 150, height: 150, marginTop: 24, marginBottom: 24 }}
        />
        <View style={{ justifyContent: "center" }}>
          <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <Auth>
              <AuthContainer>
                <AuthTitle>Email Address</AuthTitle>
                <AuthField
                  autoCapitalize="none"
                  autoCompleteType="email"
                  autoCorrect={false}
                  autoFocus={false}
                  keyboardType="email-address"
                  onChangeText={(email) => setEmail(email.trim())}
                  value={email}
                />
              </AuthContainer>
              <AuthContainer>
                <AuthTitle>Password</AuthTitle>
                <AuthField
                  autoCapitalize="none"
                  autoCompleteType="password"
                  autoCorrect={false}
                  autoFocus={false}
                  secureTextEntry={true}
                  onChangeText={(password) => setPassword(password.trim())}
                  value={password}
                />
              </AuthContainer>
            </Auth>
            <LoginContainer onPress={signIn} disabled={loading}>
              {loading ? (
                <Loading />
              ) : (
                <Text bold center color="#ffffff">
                  Login
                </Text>
              )}
            </LoginContainer>

            <RegisterContainer onPress={() => navigation.navigate("Register")}>
              <Text small bold center>
                You don't have an account?{" "}
                <Text bold color="#932432">
                  Register
                </Text>
              </Text>
            </RegisterContainer>
          </KeyboardAvoidingView>
        </View>
      </View>
      <View style={{ alignItems: "center" }}>
        <Image
          source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/cmse322.appspot.com/o/Logo%2Flogo.png?alt=media&token=2a3de4eb-186c-4f0a-a366-1f147eda183d",
          }}
          style={{
            alignSelf: "center",
            width: 150,
            height: 150,
            marginTop: 12,
            marginBottom: 12,
          }}
        />
      </View>
    </Container>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const Container = styled.View`
  flex: 1;
  background-color: white;
`;

const Auth = styled.View`
  margin-top: 0px;
`;

const AuthContainer = styled.View`
  margin-bottom: 20px;
  width: 250px;
`;

const AuthTitle = styled(Text)`
  color: #8e93a1;
  font-size: 15px;
  text-transform: uppercase;
  font-weight: 400;
`;

const AuthField = styled.TextInput`
  border-bottom-color: #8e93a1;
  border-bottom-width: 0.5px;
  height: 25px;
`;

const LoginContainer = styled.TouchableOpacity`
  margin-top: 12px
  width: 100%;
  height: 48px;
  align-items: center;
  justify-content: center;
  background-color: #222222;
  border-radius: 6px;
`;

const Loading = styled.ActivityIndicator.attrs((props) => ({
  color: "#ffffff",
  size: "small",
}))``;

const RegisterContainer = styled.TouchableOpacity`
  margin-top: 16px;
`;

const HorizontalLine = styled.View`
  border-bottom-color: #8e93a1;
  border-bottom-width: 0.5px;
  margin-bottom: 20px;
`;
const MainHorizontalLine = styled.View`
  border-top-color: #5d616e;
  border-top-width: 2px;
`;
