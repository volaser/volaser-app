declare module 'react-native-dialog-input';

type DialogInput = {
  isDialogVisible: boolean;
  title: string;
  message: string;
  hintInput: string;
  submitInput: (input: string) => void;
};

declare module 'react-native-onboarding-swiper';
declare module 'react-native-dialog';
declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
