import { colors } from "@mui/material";

const palettes = [
  {
    title: "Primary",
    colors: [
      {
        name: "normal",
        initValue: colors.blue[600],
        modifiedValue: colors.blue[600],
      },
      {
        name: "brighter",
        initValue: colors.blue[400],
        modifiedValue: colors.blue[400],
      },
      {
        name: "darker",
        initValue: colors.blue[800],
        modifiedValue: colors.blue[800],
      },
      {
        name: "foreground",
        initValue: colors.common.white,
        modifiedValue: colors.common.white,
      },
    ],
  },
  {
    title: "Secondary",
    colors: [
      {
        name: "Normal",
        initValue: colors.pink[600],
        modifiedValue: colors.pink[600],
      },
      {
        name: "Brighter",
        initValue: colors.pink[400],
        modifiedValue: colors.pink[400],
      },
      {
        name: "Darker",
        initValue: colors.pink[800],
        modifiedValue: colors.pink[800],
      },
      {
        name: "Foreground",
        initValue: colors.common.white,
        modifiedValue: colors.common.white,
      },
    ],
  },
  {
    title: "Neutral",
    colors: [
      {
        name: "Black",
        initValue: colors.common.black,
        modifiedValue: colors.common.black,
      },
      {
        name: "White",
        initValue: colors.common.white[600],
        modifiedValue: colors.common.white[600],
      },
    ],
  },
  {
    title: "Text",
    colors: [
      {
        name: "primary",
        initValue: colors.grey[800],
        modifiedValue: colors.grey[800],
      },
      {
        name: "secondary",
        initValue: colors.grey[600],
        modifiedValue: colors.grey[600],
      },
      {
        name: "disabled",
        initValue: colors.grey[200],
        modifiedValue: colors.grey[200],
      },
    ],
  },
  {
    title: "Backgrounds",
    colors: [
      {
        name: "Default",
        initValue: colors.common.white,
        modifiedValue: colors.common.white,
      },
      {
        name: "Paper",
        initValue: colors.common.white,
        modifiedValue: colors.common.white,
      },
      {
        name: "Divider",
        initValue: colors.common.black[400],
        modifiedValue: colors.common.black[400],
      },
    ],
  },
  {
    title: "Error",
    colors: [
      {
        name: "normal",
        initValue: colors.red[600],
        modifiedValue: colors.red[600],
      },
      {
        name: "Brighter",
        initValue: colors.red[400],
        modifiedValue: colors.red[400],
      },
      {
        name: "Darker",
        initValue: colors.red[800],
        modifiedValue: colors.red[800],
      },
      {
        name: "Foreground",
        initValue: colors.common.white,
        modifiedValue: colors.common.white,
      },
    ],
  },
  {
    title: "Warning",
    colors: [
      {
        name: "normal",
        initValue: colors.yellow[600],
        modifiedValue: colors.yellow[600],
      },
      {
        name: "Brighter",
        initValue: colors.yellow[400],
        modifiedValue: colors.yellow[400],
      },
      {
        name: "Darker",
        initValue: colors.yellow[800],
        modifiedValue: colors.yellow[800],
      },
      {
        name: "Foreground",
        initValue: colors.common.black,
        modifiedValue: colors.common.black,
      },
    ],
  },
  {
    title: "Info",
    colors: [
      {
        name: "normal",
        initValue: colors.blue[600],
        modifiedValue: colors.blue[600],
      },
      {
        name: "Brighter",
        initValue: colors.blue[400],
        modifiedValue: colors.blue[400],
      },
      {
        name: "Darker",
        initValue: colors.blue[800],
        modifiedValue: colors.blue[800],
      },
      {
        name: "Foreground",
        initValue: colors.common.white,
        modifiedValue: colors.common.white,
      },
    ],
  },
  {
    title: "Success",
    colors: [
      {
        name: "normal",
        initValue: colors.green[600],
        modifiedValue: colors.green[600],
      },
      {
        name: "Brighter",
        initValue: colors.green[400],
        modifiedValue: colors.green[400],
      },
      {
        name: "Darker",
        initValue: colors.green[800],
        modifiedValue: colors.green[800],
      },
      {
        name: "Foreground",
        initValue: colors.common.white,
        modifiedValue: colors.common.white,
      },
    ],
  },
  {
    title: "Gray",
    colors: [
      {
        name: "normal",
        initValue: colors.common.black[300],
        modifiedValue: colors.common.black[300],
      },
      {
        name: "Brightest",
        initValue: colors.common.black[300],
        modifiedValue: colors.common.black[300],
      },
      {
        name: "Darkerest",
        initValue: colors.common.black[300],
        modifiedValue: colors.common.black[300],
      },
      {
        name: "Foreground",
        initValue: colors.common.black[800],
        modifiedValue: colors.common.black[800],
      },
    ],
  },
  // {
  //   title: "Decorative Elements",
  //   colors: [
  //     {
  //       name: "Divider",
  //       initValue: colors.green[600],
  //       modifiedValue: colors.green[600],
  //     },
  //   ],
  // },
  // move to styles tab and control only opacity (intensity) of one main color (default to black)
  // {
  //   title: "Interactive States",
  //   colors: [
  //     {
  //       name: "active",
  //       initValue: colors.blue[600],
  //       modifiedValue: colors.blue[600],
  //     },
  //     {
  //       name: "hover",
  //       initValue: colors.blue[600],
  //       modifiedValue: colors.blue[600],
  //     },
  //     {
  //       name: "selected",
  //       initValue: colors.blue[600],
  //       modifiedValue: colors.blue[600],
  //     },
  //     {
  //       name: "disabled",
  //       initValue: colors.blue[600],
  //       modifiedValue: colors.blue[600],
  //     },
  //     {
  //       name: "disabledBackground",
  //       initValue: colors.blue[600],
  //       modifiedValue: colors.blue[600],
  //     },
  //   ],
  // },
];

export default palettes;
