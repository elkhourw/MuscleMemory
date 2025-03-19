import React from 'react';
import { StyleSheet } from 'react-native';
import { Header } from 'react-native-elements';

export const CustomHeader = ({ title = 'Titre de la page', left = null, right = null }) => {
  return (
    <Header
      leftComponent={left && {
        icon: left.icon,
        iconStyle: styles.icon,
        onPress: left.action,
        text: left.text,
        style: [styles.leftComponent],

      }}
      centerComponent={{
        text: title.text,
        style: [styles.centerComponent]
      }}
      rightComponent={right && {
        icon: right.icon,
        iconStyle: styles.icon,
        onPress: right.action,
        text: right.text,
        style: [styles.rightComponent],
      }}
      backgroundColor="#fff"
      statusBarProps={{ backgroundColor: "#fff", barStyle: 'dark-content' }}
      containerStyle={styles.headerContainer} // Style pour agrandir le header
    />
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 60, // Augmentez la hauteur du header
    alignContent: 'center', // Alignement vertical du contenu
    borderBottomWidth: 0, // Supprime la bordure inférieure si nécessaire
  },
  centerComponent: {
    fontSize: 20, // Taille du texte du titre
    fontWeight: '500', // Gras pour le titre
    textAlign: 'center', // Alignement du texte au centre
  },
  leftComponent: {
    marginLeft: 10, // Ajustez la marge gauche si nécessaire
    color: '#0891b2',
    marginTop: 5
  },
  rightComponent: {
    marginRight: 10, // Ajustez la marge droite si nécessaire
    color: '#0891b2',
    marginTop: 5,
  },
  icon: {
    marginTop: 5,
    color: "#0891b2",
  }
});