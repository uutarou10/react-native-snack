import * as React from 'react';
import * as _ from 'lodash';
import { Animated, LayoutChangeEvent, StyleSheet, Text } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';

export interface SnackbarOptions {
  message: string;
  textColor?: string;
  backgroundColor?: string;
  duration?: number;
  onCompletedShow?: () => void;
  onCompletedHide?: () => void;
}

interface SnackBarState {
  isVisible: boolean;
  bottomAnim: Animated.Value;
  currentLayout: { x: number; y: number; width: number; height: number };
  isFinishedInitialize: boolean;
  options: SnackbarOptions;
}

export class Snackbar extends React.Component<{}, SnackBarState> {
  private static singletonRef?: Snackbar;

  constructor(props: {}) {
    super(props);
    if (!_.isNil(Snackbar.singletonRef)) {
      console.warn(
        'Generated multiple snackbar instances.\nThis operation is no effect.'
      );
    } else {
      Snackbar.singletonRef = this;
    }

    this.state = {
      isVisible: false,
      bottomAnim: new Animated.Value(0),
      currentLayout: { x: 0, y: 0, width: 0, height: 0 },
      isFinishedInitialize: false,
      options: {
        message: ''
      }
    };
  }

  render() {
    const styles = this.getStyles();

    return (
      <Animated.View
        style={[styles.container, { bottom: this.state.bottomAnim }]}
        onLayout={this.onLayout}
        pointerEvents={this.state.isVisible ? 'auto' : 'none'}
      >
        <Text style={styles.text}>{this.state.options.message}</Text>
      </Animated.View>
    );
  }

  public static show(options: SnackbarOptions) {
    Snackbar.singletonRef!.show(options);
  }

  private show = (options: SnackbarOptions) => {
    this.setState({
      isVisible: true,
      options
    });

    Animated.timing(this.state.bottomAnim, {
      duration: 200,
      toValue: 0
    }).start(() => {
      if (!_.isNil(options.onCompletedShow)) {
        options.onCompletedShow();
      }

      setTimeout(this.hide, this.state.options.duration || 2000);
    });
  };

  private hide = () => {
    const { options } = this.state;
    Animated.timing(this.state.bottomAnim, {
      duration: 200,
      toValue: -this.state.currentLayout.height
    }).start(() => {
      this.setState({ isVisible: false });

      if (!_.isNil(options.onCompletedHide)) {
        options.onCompletedHide();
      }
    });
  };

  private onLayout = (event: LayoutChangeEvent) => {
    if (!this.state.isFinishedInitialize) {
      this.state.bottomAnim.setValue(-event.nativeEvent.layout.height);
    }

    this.setState({
      currentLayout: event.nativeEvent.layout,
      isFinishedInitialize: true
    });
  };

  private getStyles() {
    return StyleSheet.create({
      container: {
        position: 'absolute',
        width: '100%',
        opacity: this.state.isVisible ? 1 : 0,
        paddingBottom: ifIphoneX(34, 0),
        backgroundColor: this.state.options.backgroundColor || 'gray'
      },
      text: {
        color: this.state.options.textColor || 'white',
        fontSize: 14,
        padding: 13,
        lineHeight: 14 * 1.3
      }
    });
  }
}
