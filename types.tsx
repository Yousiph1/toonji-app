/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root:  NavigatorScreenParams<RootTabParamList> | undefined;
  Read: {songId: string};
  Modal: undefined;
  NotFound: undefined;
};

export type cardData = {
  songTitle: string;
  songId: string;
  songArtist: string;
  comments: string;
  fires: string;
  views: string;
  isFav: boolean;
  hottesBar: string;
  rating: string;
}

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  Home: undefined;
  Charts: undefined;
  Favorites: undefined;
  Profile: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;
