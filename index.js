import React, {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
} from 'react-native'

const DOT_SIZE = 6
const DOT_BORDER = 3
export default class Carousel extends React.Component {

  static propTypes = {
    interval: React.PropTypes.number,
  }

  static defaultProps = {
    interval: 3000,
  }

  state = {
    anim: new Animated.Value(0),
    width: 0,
  }

  componentWillMount = () => {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        this._panResponderReleased = false
        this.dragging = true
        this.animValue = this.state.anim._value
      },
      onPanResponderMove: (e, state) => {
        this.animationFrame = requestAnimationFrame(() => {
          if (!this._panResponderReleased) {
            const nextValue = this.state.anim._value - state.vx / 10
            if (nextValue > -1 && nextValue < this.props.children.length) {
              this.state.anim.setValue(nextValue)
            }else if (nextValue <= -1) {
              this.state.anim.setValue(this.props.children.length - 1)
            }else if (nextValue >= this.props.children.length) {
              this.state.anim.setValue(0)
            }
          }
        })
      },
      onPanResponderRelease: (e, state) => {
        this._panResponderReleased = true
        this.animationFrame = requestAnimationFrame(() => {
          this.goToPage(Math.round(this.state.anim._value), () => this.dragging = false)
        })
      },
    })
  }

  goToPage = (page, callback) => {
    Animated.spring(
      this.state.anim,
      {
        toValue: page,
        friction: 10,
        velocity: 1,
      }
    ).start(() => {
      if (page < 0) {
        this.state.anim.setValue(this.props.children.length - 1)
      }else if (page > this.props.children.length - 1) {
        this.state.anim.setValue(0)
      }
      callback && callback()
    })
  }

  autoPlay = () => {
    this.timeout = setTimeout(() => {
      if (!this.dragging) {
        this.state.anim._value + 1 > this.props.children.length && this.state.anim.setValue(0)
        this.goToPage(this.state.anim._value + 1)
      }
      this.autoPlay()
    }, this.props.interval)
  }

  componentDidMount() {
    this.autoPlay()
  }

  componentWillUnmount() {
    this.animationFrame && cancelAnimationFrame(this.animationFrame)
    this.timeout && clearTimeout(this.timeout)
  }

  render() {
    return (
        <View
          style={{flex: 1}}
          {...this._panResponder.panHandlers}
          onLayout={e => {
            this.setState({width: e.nativeEvent.layout.width})
          }}
        >
          <Animated.View style={{
            flexDirection: 'row',
            flex: 1,
            marginLeft: -this.state.width,
            transform: [
              {translateX: this.state.anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -this.state.width],
              })}
            ]
          }}>
            {this.props.children[this.props.children.length - 1]}
            {this.props.children}
            {this.props.children[0]}
          </Animated.View>
          <View style={{
            position: 'absolute',
            left: (this.state.width - 30) / 2,
            bottom: 5,
            backgroundColor: 'transparent',
            height: DOT_SIZE,
            width: DOT_SIZE * 6,
            flexDirection: 'row',
            alignItems: 'flex-end',
            overflow: 'hidden',
          }}>
            {this.props.children.map((e, i) => (
              <View key={i} style={{
                width: DOT_SIZE,
                height: DOT_SIZE,
                borderRadius: DOT_SIZE / 2,
                backgroundColor: 'rgba(100, 100, 100, 0.5)',
                marginHorizontal: DOT_BORDER,
              }}></View>
            ))}
            <Animated.View style={{
              width: DOT_SIZE,
              height: DOT_SIZE,
              position: 'absolute',
              marginLeft: DOT_BORDER,
              left: this.state.anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, DOT_SIZE * 2],
              }),
              backgroundColor: 'rgba(250, 250, 250, 0.8)',
              borderRadius: DOT_SIZE / 2,
            }}>

            </Animated.View>
          </View>
        </View>
    )
  }
}
