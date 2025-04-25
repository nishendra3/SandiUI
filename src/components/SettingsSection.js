import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Checkbox } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

const SettingsSection = ({
  manualHeight,
  setManualHeight,
  submitManualHeight, // <-- NEW: submit handler for Enter button
  selectedColors,
  setSelectedColors, // <-- NEW: will be used to only allow one color
  selectedHeight,
  handleHeightSelection
}) => {
  const getColorValue = (color) => {
    switch (color) {
      case "red": return "#ef4444";
      case "blue": return "#3b82f6";
      case "black": return "#1e293b";
      default: return "#64748b";
    }
  };

  const handleColorSelect = (color) => {
    const newSelection = {
      red: false,
      blue: false,
      black: false,
      [color]: true,
    };
    setSelectedColors(newSelection);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>2. Settings</Text>

      {/* Height Options */}
      <Text style={styles.label}>Rail Height (mm)</Text>
      <View style={styles.checkboxRow}>
        {["1100", "1200", "1500"].map((val) => (
          <View key={val} style={styles.checkboxItem}>
            <Checkbox
              status={selectedHeight === val ? "checked" : "unchecked"}
              onPress={() => handleHeightSelection(val)}
              color="#007BFF"
            />
            <Text>{val}</Text>
          </View>
        ))}
        <View style={styles.checkboxItem}>
          <Checkbox
            status={selectedHeight === "manual" ? "checked" : "unchecked"}
            onPress={() => handleHeightSelection("manual")}
            color="#007BFF"
          />
          <Text>Manual</Text>
        </View>
      </View>

      {/* Manual Height Input + Button */}
      {selectedHeight === "manual" && (
        <View style={styles.manualInputContainer}>
          <TextInput
            style={styles.input}
            value={manualHeight}
            onChangeText={setManualHeight}
            placeholder="Enter height manually"
            keyboardType="numeric"
          />
          <TouchableOpacity onPress={submitManualHeight} style={styles.enterButton}>
            <Text style={styles.enterButtonText}>Enter</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Color Selection */}
      <Text style={styles.label}>Reference Color-Band</Text>
      <View style={styles.colorOptions}>
        {Object.entries(selectedColors).map(([color, isSelected]) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorOption,
              isSelected && styles.colorOptionSelected,
              { backgroundColor: getColorValue(color) },
            ]}
            onPress={() => handleColorSelect(color)}
          >
            {isSelected && (
              <MaterialIcons name="check" size={16} color="white" />
            )}
          </TouchableOpacity>
        ))}
      </View>
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
  checkboxRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  checkboxItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  manualInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 12,
    borderRadius: 6,
    borderColor: "#cbd5e1",
    backgroundColor: "#ffffff",
    fontSize: 14,
  },
  enterButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  enterButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  colorOptions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  colorOptionSelected: {
    borderColor: "white",
  },
});

export default SettingsSection;
