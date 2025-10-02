import { StyleSheet, View } from "react-native";
import { useEffect } from "react";
import MainScreen from "./src/screens/MainScreen";

export default function App() {
  useEffect(() => {
    if (typeof document !== "undefined") {
      const style = document.createElement("style");
      style.setAttribute("data-hide-scrollbar", "true");
      style.innerHTML = `
        * { scrollbar-width: none; }
        *::-webkit-scrollbar { width: 0px; height: 0px; display: none; }
        html, body, #root { overscroll-behavior: none; }
      `;
      document.head.appendChild(style);
      return () => {
        style.remove();
      };
    }
  }, []);

  return (
    <View style={styles.container}>
      <MainScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc"
  },
});
