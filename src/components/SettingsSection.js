import React from 'react';
import { View, Text, TextInput, StyleSheet, useWindowDimensions, TouchableOpacity } from 'react-native';
import { Checkbox } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

const SettingsSection = ({
  manualHeight,
  setManualHeight,
  submitManualHeight,
  selectedColors,
  setSelectedColors,
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
    const newSelection = { red: false, blue: false, black: false, [color]: true };
    setSelectedColors(newSelection);
  };

  const { width } = useWindowDimensions();
  const unit = clamp(Math.round(width * 0.01), 2, 16);
  const controlHeight = Math.max(32, Math.round(unit * 2.2));
  const isTight = width < 560;

  return (
    <View style={[styles.section, { padding: unit }]}>
      <Text style={[styles.heading, { marginBottom: Math.round(unit * 0.8) }]}>2. Settings</Text>

      {/* Rail Height inline row */}
      <View style={[styles.inlineRow, { columnGap: Math.round(unit * 0.6), rowGap: Math.round(unit * 0.6), marginBottom: unit }]}>
        <Text style={styles.labelInline}>Rail Height (mm):</Text>
        <View style={[styles.inlineWrap, { columnGap: Math.round(unit * 0.6), rowGap: Math.round(unit * 0.4) }]}>
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
          {selectedHeight === 'manual' && (
            <TextInput
              style={[
                styles.input,
                {
                  padding: Math.round(unit * 0.5),
                  minHeight: controlHeight,
                  minWidth: 64,
                  width: 120,
                },
              ]}
              value={manualHeight}
              onChangeText={setManualHeight}
              placeholder="mm"
              keyboardType="numeric"
            />
          )}
        </View>
      </View>

      {/* Reference Color-Band inline row */}
      <View style={[styles.inlineRow, { columnGap: Math.round(unit * 0.6), rowGap: Math.round(unit * 0.6), marginTop: Math.round(unit * 0.8) }]}>
        <Text style={styles.labelInline}>Reference Color-Band:</Text>
        <View style={[styles.inlineWrap, { columnGap: Math.round(unit * 0.6), rowGap: Math.round(unit * 0.4) }]}>
          {Object.entries(selectedColors).map(([color, isSelected]) => (
            <TouchableOpacity
              key={color}
              style={[styles.colorChip, isSelected && styles.colorChipSelected, { backgroundColor: getColorValue(color) }]}
              onPress={() => handleColorSelect(color)}
              activeOpacity={0.8}
            >
              {isSelected && (
                <MaterialIcons name="check" size={16} color="#ffffff" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    flex: 1,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
  },
  labelInline: {
    fontSize: 14,
    color: '#475569',
    alignSelf: 'center',
  },
  inlineRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  inlineWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    textAlign: 'center',
  },
  colorChip: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorChipSelected: {
    borderColor: '#ffffff',
  },
});

export default SettingsSection;
