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

export type ProfileStackParamList = {
  Followers: {name: string};
}

export type ArtistProfileList = ProfileStackParamList & {
  TopFans: {name: string};
}
export type UsersProfileList = ProfileStackParamList & {
  Battles: {name: string};
}
export type ThisUserParamList = ProfileStackParamList & {
  Profile: undefined;
  Edit: {prevName: string, bio: string, picture: string};
  Following: {name: string};
  Battles: {name: string};
  Settings: undefined;
}

export type RootStackParamList = {
  Root:  NavigatorScreenParams<RootTabParamList> | undefined;
  Read: {songId: string};
  Artist: {userName: string};
  Users: {userName: string};
  TopFanQuiz: {name: string},
  Followers: {name: string, thisUser: boolean};
  TopFans: {name: string, thisUser: boolean};
  Battles: {name: string, thisUser: boolean};
  BattleQuizReady: {roomId: string};
  Signup: undefined;
  Splash: undefined;
  Login: undefined;
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
  artist: string;
  barPreview: string;
  rating: string;
  songCover: string;
}

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  Home: undefined;
  Charts: undefined;
  Favorites: undefined;
  Profile: NavigatorScreenParams<ThisUserParamList>;
  BattleQuiz: undefined,
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;
export type  awardReq  = {
  type?: "breakdown" | "comment"
  songId: string;
  breakdown?: {
    punchId: string;
    brId: string;
  },
  comment?: {
    commentId: string;
  }
}
export type brType = {
  name: string;
  isThisUser: boolean,
  totalVotes: number,
  points: string;
  date:  string;
  userVote: 'UPVOTE' | 'DOWNVOTE';
  breakdown: string;
  brAwards: {
    bronze: number;
    silver: number;
    gold: number;
    platinum: number;
    diamond: number;
    copper: number
  };
  key: number;
  songId: string;
  punchId: string;
  indx: string;
  id: string;
  picture: string;
  showModal: (dd: awardReq) => void;
  showEditModal: (dd:{br: string; songId: string; punchId: string; id: string}) => void;
  deleteBreakdown: (dd: {punchId: string; id: string}) => void
}
