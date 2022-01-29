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
    selected: true,
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
  const [hospital, setHospital] = useState();
  const [uSex, setUSex] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState();
  const [docDocument, setDocDocument] = useState();
  const [patientData, setPatientData] = useState(true);
  const [doctorData, setDoctorData] = useState(false);

  const [sex, setSex] = useState(radioButtonsData2);
  const [radioButtons, setRadioButtons] = useState(radioButtonsData);

  const onPressRadioButton = (radioButtonArray) => {
    setRadioButtons(radioButtonArray);
    if (radioButtonArray[0].selected) {
      console.log(radioButtonArray[0].value);
      setPatientData(true);
      setDoctorData(false);
    } else if (radioButtonArray[1].selected) {
      console.log(radioButtonArray[1].value);
      radioButtons[0].selected = false;
      setPatientData(false);
      setDoctorData(true);
    }
  };
  const onPressSex = (radioButtonArray) => {
    setSex(radioButtonArray);
    if (radioButtonArray[0].selected) {
      console.log(radioButtonArray[0].value);
      setUSex(radioButtonArray[0].value);
    } else if (radioButtonArray[1].selected) {
      console.log(radioButtonArray[1].value);
      setUSex(radioButtonArray[0].value);
    }
  };

  const signOutUser = () => {
    auth.signOut();
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

      await db.collection("allUsers").doc(uid).update({
        profilePhotoUrl: url,
      });

      return url;
    } catch (error) {
      console.log("Error @uploadProfilePhoto: ", error);
    }
  };

  //uploadDocument
  const uploadDocument = async (uri) => {
    const uid = getCurrentUser().uid;

    try {
      const photo = await getBlob(uri);

      const imageRef = firebase.storage().ref("docDocuments").child(uid);
      await imageRef.put(photo);

      const url = await imageRef.getDownloadURL();

      await db.collection("allUsers").doc(uid).update({
        document: url,
      });

      return url;
    } catch (error) {
      console.log("Error @uploadDocument: ", error);
    }
  };

  const createUserPatient = async (user) => {
    try {
      await auth.createUserWithEmailAndPassword(user.email, user.password);
      const uid = getCurrentUser().uid;
      let profilePhotoUrl = "default";

      await db.collection("patients").doc(uid).set({
        name: user.name,
        surname: user.surname,
        age: user.age,
        sex: user.uSex,
        email: user.email,
        profilePhotoUrl,
      });

      await db.collection("allUsers").doc(uid).set({
        name: user.name,
        surname: user.surname,
        age: user.age,
        sex: user.uSex,
        email: user.email,
        profilePhotoUrl,
      });

      if (user.profilePhoto) {
        profilePhotoUrl = await uploadProfilePhoto(user.profilePhoto);
      }
      delete user.password;
      auth.onAuthStateChanged((authUser) => {
        if (authUser) {
          navigation.replace("Home", profilePhotoUrl);
        }
      });
      return { ...user, profilePhotoUrl, uid };
    } catch (error) {
      Alert.alert(error.message);
      console.log("Error @createUser: ", error.message);
    }
  };

  const createUserDoctor = async (user) => {
    try {
      await auth.createUserWithEmailAndPassword(user.email, user.password);
      const uid = getCurrentUser().uid;
      console.log(uid);
      let profilePhotoUrl = "default";
      let docDocumentAdded = "default";

      await db.collection("allUsers").doc(uid).set({
        name: user.name,
        surname: user.surname,
        hospital: user.hospital,
        email: user.email,
        profilePhotoUrl,
        document: user.docDocument,
        approved: user.approved,
      });

      if (user.profilePhoto) {
        profilePhotoUrl = await uploadProfilePhoto(user.profilePhoto);
      }

      if (user.docDocument) {
        docDocumentAdded = await uploadDocument(user.docDocument);
      }
      delete user.password;
      signOutUser();
      alert("Account created! Pending Approval...");
      navigation.navigate("Login");

      return { ...user, profilePhotoUrl, uid };
    } catch (error) {
      Alert.alert(error.message);
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

  const pickDoc = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.cancelled) {
        setDocDocument(result.uri);
      }
    } catch (error) {
      console.log("Error @pickDoc: ", error);
    }
  };

  const addDocDocument = async () => {
    const status = await getPermissions();
    if (status !== "granted") {
      alert("We need permission to access your photo library.");

      return;
    }
    pickDoc();
  };

  const addProfilePhoto = async () => {
    const status = await getPermissions();
    if (status !== "granted") {
      alert("We need permission to access your photo library.");

      return;
    }
    pickImage();
  };

  const signUpPatient = async () => {
    const user = {
      name,
      surname,
      age,
      uSex,
      email,
      password,
      profilePhoto,
    };

    console.log(name, surname, age, uSex, email, password);
    try {
      const createdUser = await createUserPatient(user);
    } catch (error) {
      console.log("Error: @signUpPatient:", error);
    }
  };

  const signUpDoctor = async () => {
    const user = {
      name,
      surname,
      hospital,
      email,
      password,
      docDocument,
      profilePhoto,
      approved: "0",
    };

    console.log(name, surname, hospital, email, password);
    try {
      const createdUser = await createUserDoctor(user);
    } catch (error) {
      console.log("Error: @signUpDoctor:", error);
    }
  };

  //Rendering the screen components
  return (
    <Container>
      <StatusBar style="dark" />
      <Main></Main>
      <ProfilePhotoContainer onPress={addProfilePhoto}>
        {profilePhoto ? (
          <ProfilePhoto source={{ uri: profilePhoto }} />
        ) : (
          <DefaultProfilePhoto>
            <AntDesign name="plus" size={24} color="#ffffff" />
          </DefaultProfilePhoto>
        )}
      </ProfilePhotoContainer>
      <View style={{ height: 310 }}>
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
            {doctorData ? (
              <AuthContainer>
                <AuthTitle>Hospital Name</AuthTitle>
                <AuthField
                  autoCapitalize="words"
                  autoCorrect={false}
                  autoFocus={false}
                  onChangeText={(hospital) => setHospital(hospital)}
                  value={hospital}
                />
              </AuthContainer>
            ) : null}
            {doctorData ? (
              <AuthContainer>
                <AuthTitle>Approving Docs</AuthTitle>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <AppDocuments source={{ uri: docDocument }} />
                  <AppDocumentsUpload onPress={addDocDocument}>
                    <Text small bold center color="#ffffff">
                      Upload Document
                    </Text>
                  </AppDocumentsUpload>
                </View>
              </AuthContainer>
            ) : null}
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
                <AuthTitle>Gender</AuthTitle>
                <SexRadioContainer>
                  <RadioGroup
                    radioButtons={sex}
                    onPress={onPressSex}
                    layout="row"
                  />
                </SexRadioContainer>
              </SexContainer>
            ) : null}
            {patientData ? <HorizontalLine></HorizontalLine> : null}
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

            <KeyboardAvoidingView
              style={{ flex: 1, justifyContent: "center" }}
              keyboardVerticalOffset={75}
              behavior={"padding"}
            ></KeyboardAvoidingView>
          </Auth>
        </ScrollView>
      </View>
      <MainHorizontalLine></MainHorizontalLine>
      <RadioContainer>
        <RadioGroup
          radioButtons={radioButtons}
          onPress={onPressRadioButton}
          layout="row"
        />
      </RadioContainer>
      <RegisterContainer
        onPress={patientData ? signUpPatient : signUpDoctor}
        disabled={loading}
      >
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

const AppDocuments = styled.Image`
  background-color: #e1e2e6;
  width: 40px;
  height: 40px;
  border-radius: 5px;
  align-self: flex-start;
  margin-top: 16px;
  overflow: hidden;
`;

const AppDocumentsUpload = styled.TouchableOpacity`
  background-color: #222222;
  width: 80px;
  height: 40px;
  border-radius: 5px;
  align-self: flex-end;
  margin-top: 16px;
  overflow: hidden;
  align-items: center;
  justify-content: center;
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
  margin-top: 12px;
  margin-bottom: 12px;
  align-items: center;
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
  margin-bottom: 12px;
`;

const SexRadioContainer = styled.View``;

const HorizontalLine = styled.View`
  border-bottom-color: #8e93a1;
  border-bottom-width: 0.5px;
  margin-bottom: 20px;
`;
const MainHorizontalLine = styled.View`
  border-top-color: #5d616e;
  border-top-width: 2px;
`;
