# react-native-viewpager
pure javascript. cross-platform. swipable
# Usage
```javascript
class Example extends React.Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{height: 100, marginTop: 64}}>
          <Carousel>
            <View style={{Dimensions.get('window').width, backgroundColor: '#1e4de3'}}></View>
            <View style={{Dimensions.get('window').width, backgroundColor: '#5b3e28'}}></View>
            <View style={{Dimensions.get('window').width, backgroundColor: '#b2a5f9'}}></View>
          </Carousel>
        </View>
      </View>
    )
  }
}
```
