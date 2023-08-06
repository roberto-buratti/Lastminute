import * as React from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'

import * as copy from '../Assets/Copy'
import padding from '../Styles/Padding'
import colors from '../Styles/Colors'

interface IProps {
}

interface IState {
  
}

export default class FilterAndSortingDialog extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
    }
  }

  public render() {
    return <View style={styles.container}>
      <View style={styles.column}>
        <Text style={styles.title}>{copy.getString("filter_and_sorting_title")}</Text>
        <View style={{width:'100%',borderBottomColor: colors.veryLightGrey, borderBottomWidth: 1}}/>
      </View>
    </View>    
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: padding.half,
    paddingBottom: padding.full,
    width: Dimensions.get('window').width * 0.75,
  },
  column: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%'
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    width: '100%',
  }
})

