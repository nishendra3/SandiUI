import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { Platform } from "react-native";

const CADSourceSection = ({
  tmrNumber,
  setTmrNumber,
  selectedCADFile,
  setSelectedCADFile,
}) => {
  const handleSubmit = () => {
    // TODO: Add logic to fetch CAD file based on TMR number
    
  };

  const openFilePicker = async () => {
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".pdf,.txt,.step,.stp"; // You can modify file types here
      input.onchange = () => {
        const file = input.files[0];
        if (file) {
          const fileInfo = {
            name: file.name,
            uri: URL.createObjectURL(file),
            size: file.size,
            type: file.type,
          };
          setSelectedCADFile(fileInfo);
        }
      };
      input.click();
    } else {
      try {
        const result = await DocumentPicker.getDocumentAsync({
          type: ["application/step", "application/pdf", "text/plain", "*/*"],
          copyToCacheDirectory: true,
          multiple: false,
        });

        if (result.type === "success") {
          const fileInfo = {
            name: result.name,
            uri: result.uri,
            size: result.size,
            mimeType: result.mimeType,
            type: result.type,
          };
          setSelectedCADFile(fileInfo);
        } else {
          console.log("User cancelled file selection");
        }
      } catch (err) {
        console.error("File selection error:", err);
        Alert.alert("Error", "Failed to select file. Please try again.");
      }
    }
  };
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>1. CAD-Source</Text>

      <Text style={styles.label}>Drawing number (TMR)</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={tmrNumber}
          onChangeText={setTmrNumber}
          placeholder="TMR0001234"
          placeholderTextColor="#94a3b8"
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>or STEP file manually search</Text>
      <TouchableOpacity style={styles.fileButton} onPress={openFilePicker}>
        <MaterialIcons name="attach-file" size={20} color="#007BFF" />
        <Text style={styles.fileButtonText}>
          {selectedCADFile
            ? `Selected: ${selectedCADFile.name}`
            : "Browse Files"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#1e293b",
  },
  label: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 12,
    borderRadius: 6,
    borderColor: "#cbd5e1",
    backgroundColor: "#ffffff",
    marginRight: 8,
    fontSize: 14,
    color: "#1e293b",
  },
  submitButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#007BFF",
    borderRadius: 6,
  },
  submitText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  fileButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#eef2ff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#c7d2fe",
    gap: 8,
  },
  fileButtonText: {
    color: "#007BFF",
    fontWeight: "500",
    flexShrink: 1,
  },
});

export default CADSourceSection;
