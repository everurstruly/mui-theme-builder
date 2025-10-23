import { create } from "zustand";
import { combine } from "zustand/middleware";
import palettes from "./palettes";

type Palette = {
  id: string;
  title: string;
  colors: Array<{
    name: string;
    initValue: string;
    modifiedValue: string;
  }>;
};

const useColorPalettes = create(
  combine(
    {
      palettes: palettes as Array<Palette>,
    },

    (set) => ({
      addPalette: (palette: Palette) => {
        set((state) => ({
          palettes: [...state.palettes, palette],
        }));
      },

      removePalette: (paletteId: Palette["id"]) => {
        set((state) => ({
          palettes: state.palettes.filter((p) => p.id !== paletteId),
        }));
      },

      updatePalette: (paletteId: Palette["id"], updatedPalette: Palette) => {
        set((state) => ({
          palettes: state.palettes.map((p) =>
            p.id === paletteId ? { ...p, ...updatedPalette } : p
          ),
        }));
      },
    })
  )
);

export default useColorPalettes;
