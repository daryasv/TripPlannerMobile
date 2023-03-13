import React from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Text,
  Card,
  createTheme,
  ThemeProvider,
  Input,
  Button,
  Image,
} from "@rneui/themed";
import { Colors } from "../../theme/Colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

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

export const SignupContainer = ({ setMode }: CardContainer) => {
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        justifyContent: "space-between",
        paddingTop: 30,
      }}
    >
      <View>
        <Input
          label="First Name"
          placeholder="First name"
          leftIcon={{ type: "feather", name: "user" }}
        />
        <Input
          label="Last Name"
          placeholder="Last Name"
          leftIcon={{ type: "feather", name: "user" }}
        />
        <Input
          label="Username"
          placeholder="Username"
          leftIcon={{ type: "feather", name: "user" }}
        />
        <Input
          label="Email"
          placeholder="Email"
          leftIcon={{ type: "feather", name: "mail" }}
          autoComplete={"email"}
          inputMode={"email"}
          keyboardType={"email-address"}
        />
        <Input
          label="Password"
          placeholder="Password"
          leftIcon={{ type: "feather", name: "lock" }}
          keyboardType="visible-password"
          secureTextEntry={true}
        />
        <Input
          label="Confirm Password"
          placeholder="Confirm Password"
          leftIcon={{ type: "feather", name: "lock" }}
          keyboardType="visible-password"
          secureTextEntry={true}
        />

        <Button
          buttonStyle={{ backgroundColor: Colors.main }}
          title={"Sign up"}
          onPress={() => setMode("signup")}
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

export const LoginContainer = ({ setMode }: CardContainer) => {
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        justifyContent: "space-between",
        height: "100%",
        paddingTop: 30,
      }}
    >
      <View>
        <Input
          placeholder="Username"
          leftIcon={{ type: "feather", name: "user" }}
        />
        <Input
          placeholder="Password"
          leftIcon={{ type: "feather", name: "lock" }}
          secureTextEntry={true}
        />
        <Button
          buttonStyle={{ backgroundColor: Colors.main }}
          title={"Login"}
          onPress={() => setMode("login")}
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
