import React, { FunctionComponent, useState } from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../styles/styles';
import DataElementCard from './DataElementCard';

interface NoteCardProps {
  note: string;
  onNoteSave: Function;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

const NoteCard: FunctionComponent<NoteCardProps> = ({
  note,
  onNoteSave,
  style,
  disabled = false,
}) => {
  const [currentNote, setCurrentNote] = useState<string>(note);
  const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(
    true || disabled,
  );

  const saveNote = () => {
    onNoteSave(currentNote);
    setIsSaveDisabled(true);
  };

  const onChangeText = (text: string) => {
    setCurrentNote(text);
    setIsSaveDisabled(false);
  };

  return (
    <View style={style}>
      <DataElementCard
        title={'Note'}
        subtitle={'Attach a note'}
        actionText={'Save'}
        isActionDisabled={isSaveDisabled}
        onActionPress={() => {
          saveNote();
        }}
        disabled={disabled}
      >
        <View style={styles.content}>
          <View style={styles.noteWrapper}>
            <TextInput
              style={styles.noteInput}
              underlineColorAndroid="transparent"
              placeholder="Write something here..."
              placeholderTextColor="grey"
              numberOfLines={9}
              multiline={true}
              onChangeText={text => onChangeText(text)}
              defaultValue={currentNote}
              editable={!disabled}
            />
          </View>
        </View>
      </DataElementCard>
    </View>
  );
};

const styles = StyleSheet.create({
  noteWrapper: {
    backgroundColor: Colors.BG,
    paddingHorizontal: 16,
  },
  noteInput: {
    textAlign: 'left',
    textAlignVertical: 'top',
    backgroundColor: Colors.BG,
  },
  content: {
    marginBottom: 20,
  },
});

export default NoteCard;
