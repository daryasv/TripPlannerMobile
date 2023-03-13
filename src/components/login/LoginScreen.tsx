import React, { useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
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
import {
  LoginData,
  postUserLogin,
  postUserRegister,
  RegisterData,
} from "../../actions/userActions";

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
        buttonStyle={{ backgroundColor: Colors.main }}
        title={"Login"}
        onPress={() => setMode("login")}
      />
      <Button
        buttonStyle={{ borderColor: Colors.LightBlack, borderWidth: 1 }}
        titleStyle={{ color: Colors.LightBlack }}
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
      postUserRegister(data, (success) => {
        if (success) {
          setMode("login");
        } else {
          setGeneralError("Something went wrong");
        }
        setLoading(false);
      });
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        justifyContent: "space-between",
      }}
    >
      <View>
        <Input
          label="First Name"
          placeholder="First name"
          leftIcon={{ type: "feather", name: "user" }}
          value={data.userFirstName}
          onChangeText={(text) => setData({ ...data, userFirstName: text })}
          errorMessage={errors.userFirstName}
        />
        <Input
          label="Last Name"
          placeholder="Last Name"
          leftIcon={{ type: "feather", name: "user" }}
          value={data.userLastName}
          onChangeText={(text) => setData({ ...data, userLastName: text })}
          errorMessage={errors.userLastName}
        />
        <Input
          label="Username"
          placeholder="Username"
          leftIcon={{ type: "feather", name: "user" }}
          //value={data.userFirstName}
        />
        <Input
          label="Email"
          placeholder="Email"
          leftIcon={{ type: "feather", name: "mail" }}
          autoComplete={"email"}
          inputMode={"email"}
          keyboardType={"email-address"}
          value={data.userEmail}
          onChangeText={(text) => setData({ ...data, userEmail: text })}
          errorMessage={errors.userEmail}
        />
        <Input
          label="Password"
          placeholder="Password"
          leftIcon={{ type: "feather", name: "lock" }}
          keyboardType="visible-password"
          secureTextEntry={true}
          value={data.password}
          onChangeText={(text) => setData({ ...data, password: text })}
          errorMessage={errors.password}
        />
        <Input
          label="Confirm Password"
          placeholder="Confirm Password"
          leftIcon={{ type: "feather", name: "lock" }}
          keyboardType="visible-password"
          secureTextEntry={true}
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
          errorMessage={
            data.password && data.password !== confirmPassword
              ? "Passwords doesn't match"
              : null
          }
        />

        {generalError ? (
          <Text style={{ color: "red", fontSize: 14, textAlign: "center" }}>
            {generalError}
          </Text>
        ) : null}

        <Button
          buttonStyle={{ backgroundColor: Colors.main }}
          title={"Sign up"}
          onPress={() => onSignup()}
          loading={loading}
        />

        <Button
          buttonStyle={{ borderColor: Colors.LightBlack, borderWidth: 1 }}
          titleStyle={{ color: Colors.LightBlack }}
          title={"Back"}
          type="outline"
          onPress={() => setMode("options")}
        />
      </View>
      <Text style={{ alignSelf: "center" }}>
        Already have an account?{" "}
        <Text style={{ color: "#303C9A" }} onPress={() => setMode("signup")}>
          Login
        </Text>
      </Text>
    </KeyboardAwareScrollView>
  );
};

export const LoginContainer = ({ setMode }: CardContainer) => {
  const [data, setData] = useState({} as LoginData);
  const [loading, setLoading] = useState(false as boolean);

  const onLogin = () => {
    postUserLogin(data, (succees) => {
      if (succees) {
      } else {
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
          leftIcon={{ type: "feather", name: "mail" }}
          onChangeText={(text) => setData({ ...data, userEmail: text })}
          value={data.userEmail}
        />
        <Input
          placeholder="Password"
          leftIcon={{ type: "feather", name: "lock" }}
          secureTextEntry={true}
          onChangeText={(text) => setData({ ...data, password: text })}
          value={data.password}
        />
        <Button
          buttonStyle={{ backgroundColor: Colors.main }}
          title={"Login"}
          loading={loading}
          onPress={() => onLogin()}
        />
        <Button
          buttonStyle={{ borderColor: Colors.LightBlack, borderWidth: 1 }}
          titleStyle={{ color: Colors.LightBlack }}
          title={"Back"}
          type="outline"
          onPress={() => setMode("options")}
        />
      </View>
      <Text style={{ alignSelf: "center" }}>
        Don't have an account?{" "}
        <Text style={{ color: "#303C9A" }} onPress={() => setMode("signup")}>
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
      <ImageBackground
        style={{ flex: 1 }}
        source={require("../../images/backgroundlogin.png")}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <View
            style={{
              flex: mode === "options" ? 1 : 0,
              alignItems: "center",
              justifyContent: "center",
              padding: 15,
            }}
          >
            <Text h2 style={{ color: "white" }}>
              Trip Planner
            </Text>
          </View>
          <Card
            containerStyle={[styles.card, { flex: mode === "options" ? 0 : 1 }]}
          >
            {CardContainer}
          </Card>
        </View>
      </ImageBackground>
    </ThemeProvider>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    color: Colors.main,
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
  },
});
