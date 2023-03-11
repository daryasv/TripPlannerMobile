import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Text,
  Card,
  createTheme,
  ThemeProvider,
  Input,
  Button,
} from "@rneui/themed";
import { Colors } from "../../theme/Colors";

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

export const LoginContainer = ({ setMode }: CardContainer) => {
  return (
    <View>
      <Input
        placeholder="Username"
        leftIcon={{ type: "feather", name: "user" }}
      />
      <Input
        placeholder="Password"
        leftIcon={{ type: "feather", name: "lock" }}
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
  }

  return (
    <ThemeProvider theme={theme}>
      <View style={styles.container}>
        <View style={{ flex: mode === "options" ? 1 : 0.3 }}>
          <Text>Hello</Text>
        </View>
        <Card
          containerStyle={[styles.card, { flex: mode === "options" ? 0 : 1 }]}
        >
          {CardContainer}
        </Card>
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
    color: Colors.main,
    fontSize: 16,
  },
  card: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    margin: 0,
    padding: 30,
    minHeight: 250,
    flex: 1,
  },
});
