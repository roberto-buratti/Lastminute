import * as React from 'react'
import { View, Text, StyleSheet, TextInput, ViewStyle } from 'react-native'
import Slider from '@react-native-community/slider'

import IHotelsListViewModel from '../Scenes/HotelsList/IHotelsListViewModel'

import ActionButton from './ActionButton'

import * as copy from '../Assets/Copy'
import padding from '../Styles/Padding'
import colors from '../Styles/Colors'
import { star_empty, star_full } from '../Assets/Images'
import FilterAndSortingModel from '../Models/FilterAndSortingModel'
import RadioButtonGroup from './RadioButtonGroup'

interface IProps {
  viewModel: IHotelsListViewModel
  disabled: boolean
  style: ViewStyle
  onSubmit: () => void
}

interface IState {
  filterAndSortingModel: FilterAndSortingModel
  resultsCount: number
}

export default class FilterAndSorting extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    const { viewModel } = props
    this.state = {
      filterAndSortingModel: viewModel.filterAndSortingModel,
      resultsCount: viewModel.apply(viewModel.filterAndSortingModel, true)
    }
  }

  public render() {
    const { viewModel, disabled, style } = this.props
    const { filterAndSortingModel, resultsCount } = this.state

    const currencies = filterAndSortingModel.currencies
    const minPrice = filterAndSortingModel.minPrice
    const maxPrice = filterAndSortingModel.maxPrice
    const stepPrice = ((maxPrice?.value || 1) - (minPrice?.value || 0)) / 10  // [ROB] step by 10%

    const stars = Array(5).fill(0).map((_, index) => {
      return <ActionButton 
        key={index} 
        disabled={disabled}
        source={filterAndSortingModel.stars && index < filterAndSortingModel.stars ? star_full : star_empty} 
        onPress={() => {
          filterAndSortingModel.stars = index + 1          
          this._apply()
        }}
      />
    })

    const labelStars = copy.getString("stars")
    const labelUserRating = copy.getString("user_rating") + (filterAndSortingModel.userRating ? ` (${filterAndSortingModel.userRating})`: '')
    const labelCurrency = copy.getString("currency")
    const labelPrice = copy.getString("price") + ` (${Math.trunc(filterAndSortingModel.price || maxPrice?.value || 0)})`
    
    const orderByOptions = [
      copy.getString("filter_and_sorting_order_by_name"),
      copy.getString("filter_and_sorting_order_by_stars"),
      copy.getString("filter_and_sorting_order_by_user_rating"),
      copy.getString("filter_and_sorting_order_by_price"),
    ]

    //console.log(`*** FilterAndSorting:render: currency=${filterAndSortingModel.currency}, price=${filterAndSortingModel.price} => min=${minPrice?.value} max=${maxPrice?.value}`)

    return <View 
      style={{...styles.container, ...style}} 
      onLayout={() => {
        // [ROB] re-read the actual filter when closed/re-opened
        this.setState({
          filterAndSortingModel: viewModel.filterAndSortingModel,
          resultsCount: viewModel.apply(viewModel.filterAndSortingModel, true)
        })  
      }}
    >
      <View style={styles.column}>
        <Text style={styles.title}>{copy.getString("filter_and_sorting_title")}</Text>
        <TextInput
          editable={!disabled}
          placeholder=' Search by name'
          placeholderTextColor = {colors.grey}
          clearButtonMode={'always'}
          value={filterAndSortingModel.name}
          style={[
            // Android pads top of TextInput by default for some reason
            { paddingTop: 0 },
            { paddingHorizontal: 10 },
            { width: '100%', height: 50, borderRadius: 10, borderWidth: 1, borderColor: colors.veryLightGrey}
          ]}
          onChangeText={(text) => {
            filterAndSortingModel.name = text
            this._apply()
          }}
        />
        <View style={styles.row}>
          <Text numberOfLines={2} style={styles.label}>{labelStars}</Text>
          {stars}
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>{labelUserRating}</Text>
          <Slider
              style={{ width: 200 }}
              disabled={disabled}
              value={filterAndSortingModel.userRating}
              tapToSeek={true}
              minimumTrackTintColor={colors.lastminute}
              maximumTrackTintColor={colors.veryLightGrey}
              onSlidingComplete={(value) => {
                filterAndSortingModel.userRating = value
                this._apply()
              }}
              minimumValue={0}
              maximumValue={10}
              step={0.5}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>{labelCurrency}</Text>
          <RadioButtonGroup 
            containerStyle={styles.radioGroup} 
            imageStyle={styles.radioItem} 
            disabled={disabled}
            options={currencies}
            checked={currencies.indexOf(filterAndSortingModel.currency || "")}
            onDidChange={(index) => {
              filterAndSortingModel.currency = currencies[index]
              this._apply()
            }}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>{labelPrice}</Text>
          <Slider
              style={{ width: 200 }}
              disabled={disabled || !filterAndSortingModel.currency}
              value={filterAndSortingModel.price}
              tapToSeek={true}
              minimumTrackTintColor={colors.veryLightGrey}
              maximumTrackTintColor={colors.lastminute}
              onSlidingComplete={(value) => {
                filterAndSortingModel.price = value
                this._apply()
              }}
              minimumValue={minPrice?.value || 1}
              maximumValue={maxPrice?.value || 1}
              step={stepPrice}
            />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>{copy.getString("filter_and_sorting_order_by")}</Text>
        </View>
        <View style={{...styles.row, borderColor: colors.veryLightGrey, borderWidth: 1, borderRadius: 10}}>
          <RadioButtonGroup 
              containerStyle={{...styles.radioGroup, flexDirection: 'column'}}
              imageStyle={styles.radioItem} 
              disabled={disabled}
              options={orderByOptions}
              checked={filterAndSortingModel.orderBy}
              onDidChange={(index) => {
                filterAndSortingModel.orderBy = index
                this._apply()
              }}
            />
        </View>
        <View style={{...styles.row, marginTop: 10}}>
          <ActionButton 
            style={styles.action}
            contentStyle={{ color: colors.white, fontWeight: 'bold' }} 
            disabled={disabled || resultsCount < 1}
            onPress={() => {
              this._submit()
            }}
            title={copy.getString("filter_and_sorting_submit", { $resultsCount: `${resultsCount}` })}
          />
          <ActionButton 
            style={styles.action}
            contentStyle={{ color: colors.white, fontWeight: 'bold' }} 
            disabled={disabled}
            onPress={() => {
              console.log(`*** RESET: filterAndSortingModel=${JSON.stringify(filterAndSortingModel)}`)
              filterAndSortingModel.reset()
              this._apply()
            }}
            title={copy.getString("filter_and_sorting_reset")}
          />
        </View>
      </View>
    </View>    
  }

  // MARK: - Private

  private _apply() {
    this.setState({
      filterAndSortingModel: this.state.filterAndSortingModel,
      resultsCount: this.props.viewModel.apply(this.state.filterAndSortingModel, true)
    })
  }

  private _submit() {
    this.props.viewModel.apply(this.state.filterAndSortingModel, false)
    this.props.onSubmit()
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: padding.half,
    width: '100%',
  },
  column: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%'
  },
  row: {
    flex: 0,
    padding: padding.half,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    width: '100%',
    marginBottom: 20
  },
  label: {
    flex: 1,
    textAlign: 'left',
  },
  radioGroup: {
    flexDirection: 'row'
  },
  radioItem: {
    tintColor: colors.lastminute
  },
  action: {
    height: 50, 
    width: '45%',
    // flex: 1, 
    justifyContent:'center', 
    padding: 10, 
    borderRadius: 10, 
    borderWidth: 1, 
    backgroundColor: colors.lastminute, 
    borderColor: colors.lastminute
  }
})

