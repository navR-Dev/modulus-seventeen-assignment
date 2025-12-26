import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onSelect: () => void;
};

const ListActionSheet = ({
  visible,
  onClose,
  onEdit,
  onSelect,
}: Props) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet}>
          <Pressable style={styles.item} onPress={onEdit}>
            <Text style={styles.text}>Edit</Text>
          </Pressable>

          <Pressable style={styles.item} onPress={onSelect}>
            <Text style={styles.text}>Select</Text>
          </Pressable>

          <Pressable style={[styles.item, styles.cancel]} onPress={onClose}>
            <Text style={[styles.text, styles.cancelText]}>
              Cancel
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ListActionSheet;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 8,
  },
  item: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 16,
  },
  cancel: {
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  cancelText: {
    color: '#d32f2f',
    fontWeight: '500',
  },
});
