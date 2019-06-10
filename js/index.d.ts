import * as React from 'react';
import { Animated } from 'react-native';
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
    currentLayout: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    isFinishedInitialize: boolean;
    options: SnackbarOptions;
}
export declare class Snackbar extends React.Component<{}, SnackBarState> {
    private static singletonRef?;
    constructor(props: {});
    render(): {};
    static show(options: SnackbarOptions): void;
    private show;
    private hide;
    private onLayout;
    private getStyles;
}
export {};
//# sourceMappingURL=index.d.ts.map