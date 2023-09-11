import React, { useState } from "react";
import {
  DeviceEventEmitter,
  DevSettings,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Text,
  Card,
  createTheme,
  ThemeProvider,
  Input,
  Button,
} from "@rneui/themed";
import { Colors } from "../../theme/Colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

import {
  LoginData,
  postUserLogin,
  postUserRegister,
  RegisterData,
} from "../../actions/userActions";
import { USER_DETAILS_STORAGE_NAME } from "../../actions/security";
import { Image } from "react-native-elements";
const Logo = require("../../images/logo.jpg");

const theme = createTheme({
  components: {
    Button: (props, theme) => ({
      buttonStyle: [{ marginBottom: 10, marginTop: 10, borderRadius: 100 }],
    }),
    Text: {
      style: {
        marginBottom: 10,
      },
    },
  },
});

type Mode = "options" | "login" | "signup";

interface CardContainer {
  setMode(mode: Mode): void;
}

export const OptionsContainer = ({ setMode }: CardContainer) => {
  return (
    <View>
      <Text style={styles.welcome}>Welcome</Text>
      <Button
        buttonStyle={{ borderColor: "white", borderWidth: 1 }}
        titleStyle={{ color: "white" }}
        title={"Login"}
        type="outline"
        onPress={() => setMode("login")}
      />
      <Button
        buttonStyle={{ borderColor: "white", borderWidth: 1 }}
        titleStyle={{ color: "white" }}
        title={"Sign Up"}
        type="outline"
        onPress={() => setMode("signup")}
      />
    </View>
  );
};

const REGISTER_VALIDATIONS = {
  userFirstName: 2,
  userLastName: 2,
  userEmail: 3,
  password: 6,
};

export const SignupContainer = ({ setMode }: CardContainer) => {
  const [image, setImage] = useState(null as ImagePicker.ImagePickerAsset);
  const [data, setData] = useState({
    userFirstName: "",
    userLastName: "",
    userEmail: "",
    password: "",
  } as RegisterData);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({} as Partial<RegisterData>);
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false as boolean);

  const onSignup = () => {
    if (loading) return;

    if (data.userFirstName?.length < REGISTER_VALIDATIONS.userFirstName) {
      setErrors({ userFirstName: "Invalid user first name" });
    } else if (data.userLastName?.length < REGISTER_VALIDATIONS.userLastName) {
      setErrors({ userLastName: "Invalid user last name" });
    } else if (data.userEmail?.length < REGISTER_VALIDATIONS.userEmail) {
      setErrors({ userEmail: "Invalid user email" });
    } else if (data.password?.length < REGISTER_VALIDATIONS.password) {
      setErrors({
        password: `Invalid password, minimum ${REGISTER_VALIDATIONS.password} letters`,
      });
    } else if (data.password !== confirmPassword) {
      return;
    } else {
      setErrors({});
      setLoading(true);
      setGeneralError("");
      postUserRegister(data, image, (success) => {
        if (success) {
          setMode("login");
        } else {
          setGeneralError("Something went wrong");
        }
        setLoading(false);
      });
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        justifyContent: "space-between",
      }}
    >
      <View>
        <TouchableOpacity
          style={{
            borderColor: "#aaa",
            borderWidth: 1,
            width: 100,
            aspectRatio: 1,
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
            backgroundColor: "#aaa",
            alignSelf: "center",
          }}
          onPress={pickImage}
        >
          {image ? (
            <Image
              source={{
                uri: image?.uri,
              }}
              style={{
                width: 100,
                aspectRatio: 1,
                borderRadius: 50,
                resizeMode: "cover",
              }}
            />
          ) : (
            <Text
              style={{
                fontWeight: "600",
                fontSize: 13,
                color: "white",
                textAlign: "center",
                marginTop: 10,
              }}
            >
              Profile Image
            </Text>
          )}
        </TouchableOpacity>
        <Input
          label="First Name"
          labelStyle={{color:"white"}}
          placeholder="First name"
          leftIcon={{ type: "feather", name: "user", color: "white" }}
          value={data.userFirstName}
          onChangeText={(text) => setData({ ...data, userFirstName: text })}
          errorMessage={errors.userFirstName}
          style={{ color: "white" }}
          placeholderTextColor={"white"}
          
        />
        <Input
          label="Last Name"
          labelStyle={{color:"white"}}
          placeholder="Last Name"
          leftIcon={{ type: "feather", name: "user" ,color:"white"}}
          value={data.userLastName}
          onChangeText={(text) => setData({ ...data, userLastName: text })}
          errorMessage={errors.userLastName}
          style={{ color: "white" }}
          placeholderTextColor={"white"}
        />
        <Input
          label="Username"
          labelStyle={{color:"white"}}
          placeholder="Username"
          leftIcon={{ type: "feather", name: "user",color:"white" }}
          //value={data.userFirstName}
          style={{ color: "white" }}
          placeholderTextColor={"white"}
        />
        <Input
          label="Email"
          labelStyle={{color:"white"}}
          placeholder="Email"
          leftIcon={{ type: "feather", name: "mail",color:"white" }}
          autoComplete={"email"}
          inputMode={"email"}
          keyboardType={"email-address"}
          value={data.userEmail}
          onChangeText={(text) => setData({ ...data, userEmail: text })}
          errorMessage={errors.userEmail}
          style={{ color: "white" }}
          placeholderTextColor={"white"}
        />
        <Input
          label="Password"
          labelStyle={{color:"white"}}
          placeholder="Password"
          leftIcon={{ type: "feather", name: "lock" ,color:"white"}}
          secureTextEntry={true}
          value={data.password}
          onChangeText={(text) => setData({ ...data, password: text })}
          errorMessage={errors.password}
          style={{ color: "white" }}
          placeholderTextColor={"white"}
        />
        <Input
          label="Confirm Password"
          labelStyle={{color:"white"}}
          placeholder="Confirm Password"
          leftIcon={{ type: "feather", name: "lock" ,color:"white"}}
          secureTextEntry={true}
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
          errorMessage={
            data.password && data.password !== confirmPassword
              ? "Passwords doesn't match"
              : null
          }
          style={{ color: "white" }}
          placeholderTextColor={"white"}
        />

        {generalError ? (
          <Text style={{ color: "red", fontSize: 14, textAlign: "center" }}>
            {generalError}
          </Text>
        ) : null}

        <Button
          buttonStyle={{
            borderColor: "white",
            borderWidth: 1,
            backgroundColor: Colors.LightBlack,
          }}
          titleStyle={{ color: "white" }}
          type="outline"
          title={"Sign up"}
          onPress={() => onSignup()}
          disabled={
            !image ||
            !data.userEmail ||
            !data.userFirstName ||
            !data.userLastName ||
            !data.password ||
            !confirmPassword
          }
          loading={loading}
        />

        <Button
          buttonStyle={{ borderColor: "white", borderWidth: 1 }}
          titleStyle={{ color: "white" }}
          title={"Back"}
          type="outline"
          onPress={() => setMode("options")}
        />
      </View>
      <Text style={{ alignSelf: "center",color:"white" }}>
        Already have an account?{" "}
        <Text style={{ color: "white" }} onPress={() => setMode("login")}>
          Login
        </Text>
      </Text>
    </KeyboardAwareScrollView>
  );
};

export const LoginContainer = ({ setMode }: CardContainer) => {
  const [data, setData] = useState({} as LoginData);
  const [loading, setLoading] = useState(false as boolean);
  const [generalError, setGeneralError] = useState("");

  const onLogin = () => {
    setLoading(true);

    postUserLogin(data, async (succees) => {
      setLoading(false);
      setGeneralError("");
      if (succees) {
        await AsyncStorage.setItem(
          USER_DETAILS_STORAGE_NAME,
          JSON.stringify(succees)
        );
        DeviceEventEmitter.emit("token_changed");
        //DevSettings.reload();
        //Updates.reloadAsync();//reload the app after password saved
      } else {
        setGeneralError("Something went wrong...");
      }
    });
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        justifyContent: "space-between",
        height: "100%",
        paddingTop: 10,
      }}
    >
      <View>
        <Input
          placeholder="Email"
          leftIcon={{ type: "feather", name: "mail",color:"white" }}
          onChangeText={(text) => setData({ ...data, userEmail: text })}
          value={data.userEmail}
          style={{ color: "white" }}
          placeholderTextColor={"white"}
        />
        <Input
          placeholder="Password"
          leftIcon={{ type: "feather", name: "lock",color:"white" }}
          secureTextEntry={true}
          onChangeText={(text) => setData({ ...data, password: text })}
          value={data.password}
          style={{ color: "white" }}
          placeholderTextColor={"white"}
        />

        {generalError ? (
          <Text style={{ color: "red", fontSize: 14, textAlign: "center" }}>
            {generalError}
          </Text>
        ) : null}

        <Button
          buttonStyle={{
            borderColor: "white",
            borderWidth: 1,
            backgroundColor: Colors.LightBlack,
          }}
          titleStyle={{ color: "white" }}
          type="outline"
          title={"Login"}
          loading={loading}
          onPress={() => onLogin()}
        />
        <Button
          buttonStyle={{ borderColor: "white", borderWidth: 1 }}
          titleStyle={{ color: "white" }}
          title={"Back"}
          type="outline"
          onPress={() => setMode("options")}
        />
      </View>
      <Text style={{ alignSelf: "center",color:"white"}}>
        Don't have an account?{" "}
        <Text onPress={() => setMode("signup")}>
          Sign Up
        </Text>
      </Text>
    </KeyboardAwareScrollView>
  );
};

const LoginScreen = () => {
  const [mode, setMode] = React.useState("options" as Mode);

  let CardContainer = null;
  switch (mode) {
    case "options":
      CardContainer = <OptionsContainer setMode={setMode} />;
      break;
    case "login":
      CardContainer = <LoginContainer setMode={setMode} />;
      break;
    case "signup":
      CardContainer = <SignupContainer setMode={setMode} />;
      break;
  }

  return (
    <ThemeProvider theme={theme}>
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <View style={styles.container}>
          <View
            style={{
              flex: mode === "options" ? 1 : 0,
              alignItems: "center",
              justifyContent: "center",
              padding: 15,
            }}
          >
            <Image
              source={Logo}
              style={{ width: "60%", aspectRatio: 2, resizeMode: "contain" }}
            />
          </View>
          <Card
            containerStyle={[styles.card, { flex: mode === "options" ? 0 : 1 }]}
          >
            {CardContainer}
          </Card>
        </View>
      </View>
    </ThemeProvider>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    color: "white",
    fontSize: 16,
  },
  card: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    margin: 0,
    padding: 30,
    paddingBottom: 0,
    minHeight: 250,
    flex: 1,
    backgroundColor: "#2b4961",
  },
});
