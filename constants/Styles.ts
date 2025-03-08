import { Dimensions, } from "react-native";

export const BorderRadius = {
  default: 10,
  none: 0,
  medium: 20,
  large: 35,
  full: 9999999999999
};

export const Distance = {
  default: 15,
  medium: 20,
  large: 35,
};

export const Color = {
  white: '#FFFFFF',
  black: '#07314A',
  semiblack: '#9A9DB4',
  grey: '#6E777C',
  greyLight: "#DCDEDF",

  accent1: '#A2E1FE',
  accent2: '#FFD16C',
  accent3: '#C3B7FF',
  accent4: '#B6F399',
  accent5: '#FF9FB0',

  primary: '#A2E1FE',
  primaryMedium: '#34C4FC',
  secondary: '#FFD16C',

  text: '#07314A',
  background: '#FEFEFD',
  blank: '#ECEDF4',

  shadow: '#F0F0F0',
  placeholder: '#63667E',
  danger: '#F66666',
  primaryGradient: ["#40D5CD", "#A2E1FE"],
  primaryBackdropGradient: ["#1F6B85", "#357F79"]
};

export const AccentColors = [
  Color.accent1,
  Color.accent2,
  Color.accent3,
  Color.accent4,
  Color.accent5,
];

export const Shadow = {
  small: {
    shadowColor: Color.semiblack,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 1,
  },
  medium: {
    shadowColor: Color.semiblack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  large: {
    shadowColor: Color.semiblack,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 4,
  },
  extraLarge: {
    shadowColor: Color.semiblack,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 7.49,
    elevation: 6,
  },
  superLarge: {
    shadowColor: Color.semiblack,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
};

// Screen Content = Screen height - Navbar height
export const ScreenContentHeight = Dimensions.get("window").height - 49

export const Size = {
  screen: Dimensions.get('window'),
}

export const IsMobileScreen = Size.screen.width <= 900

export const ResponsiveComponent = {
  width: IsMobileScreen ? Size.screen.width * 0.8 : 320
}

export const ANDROID_RIPPLE = {
  color: Color.shadow,
  borderless: false,
}

export const LoadingStyle = {
  opacity: 0.5,
  pointerEvents: "none",
}