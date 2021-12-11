import { StatusBar } from "expo-status-bar";
import React, { useEffect, useLayoutEffect, useState } from "react";
import styled from "styled-components";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import RadioGroup from "react-native-radio-buttons-group";
import { auth, db } from "../backend/firebase";
import firebase from "firebase";
import Text from "../components/Text";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const radioButtonsData = [
  {
    id: "1", // acts as primary key, should be unique and non-empty string
    label: "Patient",
    value: "patient",
  },
  {
    id: "2",
    label: "Doctor",
    value: "doctor",
  },
];
const radioButtonsData2 = [
  {
    id: "1", // acts as primary key, should be unique and non-empty string
    label: "Male",
    value: "male",
    size: 20,
    color: "#439CEF",
  },
  {
    id: "2",
    label: "Female",
    value: "female",
    size: 20,
    color: "pink",
  },
];

export default function RegisterScreen({ navigation }) {
  //Getting the values of input fields
  const [name, setName] = useState();
  const [surname, setSurname] = useState();
  const [age, setAge] = useState();
  const [country, setCountry] = useState();
  const [prevInst, setPrevInst] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState();
  const [patientData, setPatientData] = useState(false);
  const [doctorData, setDoctorData] = useState(false);

  const [sex, setSex] = useState(radioButtonsData2); //not implemented in firebase
  const [radioButtons, setRadioButtons] = useState(radioButtonsData);

  const onPressRadioButton = (radioButtonArray) => {
    setRadioButtons(radioButtonArray);
    if (radioButtonArray[0].selected) {
      console.log(radioButtonArray[0].value);
      setPatientData(true);
      setDoctorData(false);
    } else if (radioButtonArray[1].selected) {
      console.log(radioButtonArray[1].value);
      setPatientData(false);
      setDoctorData(true);
    }
  };
  const onPressSex = (radioButtonArray) => {
    setSex(radioButtonArray);
    if (radioButtonArray[0].selected) {
      console.log(radioButtonArray[0].value);
    } else if (radioButtonArray[1].selected) {
      console.log(radioButtonArray[1].value);
    }
  };

  //Manipulating the top bar
  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: " ",
      headerTintColor: "black",
    });
  }, [navigation]);

  const getCurrentUser = () => {
    return auth.currentUser;
  };

  const getBlob = async (uri) => {
    return await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.onload = () => {
        resolve(xhr.response);
      };

      xhr.onerror = () => {
        reject(new TypeError("Network request failed."));
      };

      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  };

  const uploadProfilePhoto = async (uri) => {
    const uid = getCurrentUser().uid;

    try {
      const photo = await getBlob(uri);

      const imageRef = firebase.storage().ref("profilePhotos").child(uid);
      await imageRef.put(photo);

      const url = await imageRef.getDownloadURL();

      await db.collection("users").doc(uid).update({
        profilePhotoUrl: url,
      });

      return url;
    } catch (error) {
      console.log("Error @uploadProfilePhoto: ", error);
    }
  };

  const createUser = async (user) => {
    try {
      await auth.createUserWithEmailAndPassword(user.email, user.password);
      const uid = getCurrentUser().uid;
      console.log(uid);
      let profilePhotoUrl = "default";

      await db.collection("users").doc(uid).set({
        name: user.name,
        surname: user.surname,
        age: user.age,
        prevInst: user.prevInst,
        country: user.country,
        email: user.email,
        profilePhotoUrl,
      });

      if (user.profilePhoto) {
        profilePhotoUrl = await uploadProfilePhoto(user.profilePhoto);
      }
      delete user.password;
      return { ...user, profilePhotoUrl, uid };
    } catch (error) {
      Alert.alert(error.message);
      setUser((state) => ({ ...state, isLoggedIn: false }));
      console.log("Error @createUser: ", error.message);
    }
  };

  const getPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      return status;
    }
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.cancelled) {
        setProfilePhoto(result.uri);
      }
    } catch (error) {
      console.log("Error @pickImage: ", error);
    }
  };

  const addProfilePhoto = async () => {
    const status = await getPermissions();
    if (status !== "granted") {
      alert("We need permission to access your photo library.");

      return;
    }
    pickImage();
  };

  const signUp = async () => {
    const user = {
      name,
      surname,
      age,
      prevInst,
      country,
      email,
      password,
      profilePhoto,
    };

    console.log(name, surname, age, prevInst, country, email, password);
    try {
      const createdUser = await createUser(user);
    } catch (error) {
      console.log("Error: @signUp:", error);
    }
  };
  //Rendering the screen components
  return (
    <Container>
      <StatusBar style="dark" />
      <Main>
        <Text medium semi center>
          Register as Patient, Doctor, or Gov Auth
        </Text>
      </Main>
      <ProfilePhotoContainer onPress={addProfilePhoto}>
        {profilePhoto ? (
          <ProfilePhoto source={{ uri: profilePhoto }} />
        ) : (
          <DefaultProfilePhoto>
            <AntDesign name="plus" size={24} color="#ffffff" />
          </DefaultProfilePhoto>
        )}
      </ProfilePhotoContainer>
      <View style={{ height: 300 }}>
        <ScrollView>
          <Auth>
            <AuthContainer>
              <AuthTitle>Name</AuthTitle>
              <AuthField
                autoCapitalize="words"
                autoCorrect={false}
                autoFocus={false}
                onChangeText={(name) => setName(name)}
                value={name}
              />
            </AuthContainer>

            <AuthContainer>
              <AuthTitle>Surname</AuthTitle>
              <AuthField
                autoCapitalize="words"
                autoCorrect={false}
                autoFocus={false}
                onChangeText={(surname) => setSurname(surname)}
                value={surname}
              />
            </AuthContainer>
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
            {patientData ? (
              <AuthContainer>
                <AuthTitle>Age</AuthTitle>
                <AuthField
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoFocus={false}
                  keyboardType="numeric"
                  onChangeText={(age) => setAge(age)}
                  value={age}
                />
              </AuthContainer>
            ) : null}
            {patientData ? (
              <SexContainer>
                <AuthTitle>Sex</AuthTitle>
                <SexRadioContainer>
                  <RadioGroup
                    radioButtons={sex}
                    onPress={onPressSex}
                    layout="row"
                  />
                </SexRadioContainer>
              </SexContainer>
            ) : null}

            <AuthContainer>
              <AuthTitle>Previous Institution</AuthTitle>
              <AuthField
                autoCapitalize="words"
                autoCorrect={false}
                autoFocus={false}
                onChangeText={(prevInst) => setPrevInst(prevInst)}
                value={prevInst}
              />
            </AuthContainer>

            <AuthContainer>
              <AuthTitle>Country</AuthTitle>
              <AuthField
                autoCapitalize="words"
                autoCorrect={false}
                autoFocus={false}
                onChangeText={(country) => setCountry(country)}
                value={country}
              />
            </AuthContainer>

            <KeyboardAvoidingView
              style={{ flex: 1, justifyContent: "center" }}
              keyboardVerticalOffset={75}
              behavior={"padding"}
            ></KeyboardAvoidingView>
          </Auth>
        </ScrollView>
      </View>
      <RadioContainer>
        <RadioGroup
          radioButtons={radioButtons}
          onPress={onPressRadioButton}
          layout="row"
        />
      </RadioContainer>
      <RegisterContainer onPress={signUp} disabled={loading}>
        {loading ? (
          <Loading />
        ) : (
          <Text bold center color="#ffffff">
            Register
          </Text>
        )}
      </RegisterContainer>

      <LoginContainer onPress={() => navigation.navigate("Login")}>
        <Text small bold center>
          Already have an account?{" "}
          <Text bold color="#932432">
            Login
          </Text>
        </Text>
      </LoginContainer>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: white;
`;

const Main = styled.View`
  margin-top: 10px;
`;

const ProfilePhotoContainer = styled.TouchableOpacity`
  background-color: #e1e2e6;
  width: 80px;
  height: 80px;
  border-radius: 40px;
  align-self: center;
  margin-top: 16px;
  overflow: hidden;
  margin-bottom: 16px;
`;

const DefaultProfilePhoto = styled.View`
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const ProfilePhoto = styled.Image`
  flex: 1;
`;

const Auth = styled.View`
  margin: 20px 32px 32px;
`;

const AuthContainer = styled.View`
  margin-bottom: 20px;
`;

const RadioContainer = styled.View`
  margin-bottom: 20px;
  align-items: center;
`;

const AuthTitle = styled(Text)`
  color: #8e93a1;
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 300;
`;

const AuthField = styled.TextInput`
  border-bottom-color: #8e93a1;
  border-bottom-width: 0.5px;
  height: 25px;
`;

const RegisterContainer = styled.TouchableOpacity`
  margin: 0 32px;
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

const LoginContainer = styled.TouchableOpacity`
  margin-top: 16px;
`;

const SexContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const SexRadioContainer = styled.View``;
