import { getNestedValue } from "./utils/objectHelpers";
import { useThemeSheetStore } from "./themeSheetStore";
import { useThemeSheet } from "./useThemeSheet";

export const useThemeSheetEditValue = (path: string) => {
  const { theme } = useThemeSheet();
  const setThemeOption = useThemeSheetStore(
    (state) => state.addThemeOptionsUserEdit
  );

  const shouldBeEditedWithCode = false;
  const value = getNestedValue(theme, path) as string;
  const isUserEditted = false;

  const setValue = (value: string) => {
    setThemeOption(path, value);
  };

  const resetToBase = () => {
    // omo
  };

  return {
    value,
    shouldBeEditedWithCode,
    isUserEditted,
    setValue,
    resetToBase,
  };
};
