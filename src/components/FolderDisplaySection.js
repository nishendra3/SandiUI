import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";

const FolderDisplaySection = ({ outputFolder, setOutputFolder }) => {
  const handlePickFolder = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: false,
      });

      if (result?.assets && result.assets.length > 0) {
        const fileUri = result.assets[0].uri;
        const folderPath = fileUri.substring(0, fileUri.lastIndexOf("/"));
        setOutputFolder(folderPath);
      } else {
        console.log("No file selected or user cancelled.");
      }
    } catch (error) {
      console.error("Error picking folder:", error);
    }
  };

  return (
    <View style={styles.fullSection}>
      <Text style={styles.heading}>Program Output Folder:</Text>
      <View style={styles.fileDisplay}>
        <MaterialIcons name="folder" size={24} color="#28a745" />
        <Text style={styles.fileText}>
          {outputFolder
            ? outputFolder.split("/").filter(Boolean).pop()
            : "No folder selected"}
        </Text>
      </View>
      <TouchableOpacity style={styles.folderButton} onPress={handlePickFolder}>
        <Text style={styles.folderButtonText}>Select Folder</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  fullSection: {
    width: "100%",
    padding: 20,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#1e293b",
  },
  fileDisplay: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  fileText: {
    color: "#334155",
    fontSize: 14,
  },
  folderButton: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#28a745",
    borderRadius: 6,
    alignItems: "center",
  },
  folderButtonText: {
    color: "white",
    fontWeight: "500",
  },
});

export default FolderDisplaySection;
