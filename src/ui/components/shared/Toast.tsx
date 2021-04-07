import { ToastAndroid } from 'react-native';

interface ToastProps {
  visible: boolean;
  message: string;
}

const Toast = ({ visible, message }: ToastProps) => {
  if (visible) {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
    );
    return null;
  }
  return null;
};

export default Toast;
