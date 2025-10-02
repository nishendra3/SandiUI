import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { Platform, useWindowDimensions } from "react-native";

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

const CADSourceSection = ({
  tmrNumber,
  setTmrNumber,
  selectedCADFile,
  setSelectedCADFile,
}) => {
  const openFilePicker = async () => {
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".pdf,.txt,.step,.stp";
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
        }
      } catch (err) {
        console.error("File selection error:", err);
        Alert.alert("Error", "Failed to select file. Please try again.");
      }
    }
  };

  const { width } = useWindowDimensions();
  const unit = clamp(Math.round(width * 0.01), 2, 16);
  const controlHeight = Math.max(36, Math.round(unit * 2.6));

  return (
    <View style={[styles.section, { padding: unit, borderRadius: Math.round(unit * 0.6) }]}>
      <Text style={[styles.heading, { marginBottom: Math.round(unit * 0.8) }]}>1. CAD-Source</Text>

      <Text style={[styles.label, { marginBottom: Math.round(unit * 0.5) }]}>Select STEP/PDF/TXT file</Text>
      <TouchableOpacity
        style={[
          styles.fileButton,
          {
            padding: Math.round(unit * 0.6),
            minHeight: controlHeight,
            width: "100%",
            maxWidth: "100%",
            alignSelf: "stretch",
            justifyContent: "flex-start",
            overflow: "hidden",
          },
        ]}
        onPress={openFilePicker}
      >
        <MaterialIcons name="attach-file" size={20} color="#007BFF" style={{ marginRight: Math.round(unit * 0.4) }} />
        <Text style={styles.fileButtonText} numberOfLines={1} ellipsizeMode="middle">
          {selectedCADFile ? `Selected: ${selectedCADFile.name}` : "Browse Files"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    flex: 1,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    minWidth: 0,
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
  },
  label: {
    fontSize: 14,
    color: "#475569",
  },
  fileButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eef2ff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#c7d2fe",
    minWidth: 0,
  },
  fileButtonText: {
    color: "#007BFF",
    fontWeight: "500",
    flexShrink: 1,
    minWidth: 0,
  },
});

export default CADSourceSection;
