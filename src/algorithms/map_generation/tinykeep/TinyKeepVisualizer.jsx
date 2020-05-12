import React from 'react';

import SideBar from '../../../components/sidebar/SideBar'
import TinyKeepOptions from './TinyKeepOptions'
import TinyKeep from './TinyKeep'

import './TinyKeepVisualizer.css'

/**
 * Represents the visualizing container for the options sidebar and the canvas
 */
export default class TinyKeepVisualizer extends React.Component {
    constructor(props) {
        super(props);
        this.handleRoomWidthChange = this.handleRoomWidthChange.bind(this);
        this.handleRoomHeightChange = this.handleRoomHeightChange.bind(this);
        this.handleStdDeviationChange = this.handleStdDeviationChange.bind(this);
        this.handleRadiusChange = this.handleRadiusChange.bind(this);
        this.handleRoomAmountChange = this.handleRoomAmountChange.bind(this);
        this.handleSpeedChange = this.handleSpeedChange.bind(this);
        this.handleVisualizeButtonClick = this.handleVisualizeButtonClick.bind(this);
        this.handleStep = this.handleStep.bind(this);
        this.handleReset = this.handleReset.bind(this);

        //sets the initial state on refresh
        this.state = {
            roomWidth: 40,
            roomHeight: 40,
            stdDeviation: 5,
            radius: 40,
            roomAmount: 15,
            speed: 1,
            step: 1,
            reset: false,
          }
    }

    //sets the room width for the next visualization
    handleRoomWidthChange(roomWidth) {
        this.setState({ roomWidth: roomWidth });
    }

    //sets the room height for the next visualization
    handleRoomHeightChange(roomHeight) {
        this.setState({ roomHeight: roomHeight });
    }

    //sets the standard deviation for the next visualization
    handleStdDeviationChange(stdDeviation) {
        this.setState({ stdDeviation: stdDeviation });
    }
  
    //sets the radius for the next visualization
    handleRadiusChange(radius) {
        this.setState({ radius: radius });
    }

    //sets the room amount for the next visualization
    handleRoomAmountChange(roomAmount) {
        this.setState({ roomAmount: roomAmount });
    }

    //sets the speed for the next visualization
    handleSpeedChange(speed) {
        this.setState({ speed: speed });
    }

    //resets the canvas and starts the next visualization
    handleVisualizeButtonClick() {
        this.setState({ step: 0, reset: true });
    }

    //sets reset back to false so we don't keep resetting
    handleReset() {
        this.setState({ reset: false });
    }

    //steps through the visualization
    handleStep() {
        this.setState((prevState) => ({
            step: prevState.step + 1
        }));
    }

    //renders the actual visualization and sidebars
    render() {
        let roomWidth = this.state.roomWidth;
        let roomHeight = this.state.roomHeight;
        let stdDeviation = this.state.stdDeviation;
        let radius = this.state.radius;
        let roomAmount = this.state.roomAmount;
        let speed = this.state.speed;
        let step = this.state.step;
        let reset = this.state.reset;

        return (
            <div className="TinyKeepVisualizer">
                <SideBar/>
                <TinyKeep
                    roomWidth={roomWidth}
                    roomHeight={roomHeight}
                    stdDeviation={stdDeviation}
                    radius={radius}
                    roomAmount={roomAmount}
                    speed={speed}
                    step={step}
                    reset={reset}
                    incrementStep={this.handleStep}
                    onReset={this.handleReset}
                    />
                <TinyKeepOptions
                    roomWidth={roomWidth}
                    roomHeight={roomHeight}
                    stdDeviation={stdDeviation}
                    radius={radius}
                    roomAmount={roomAmount}
                    speed={speed}
                    onRoomWidthChange={this.handleRoomWidthChange}
                    onRoomHeightChange={this.handleRoomHeightChange}
                    onStdDeviationChange={this.handleStdDeviationChange}
                    onRadiusChange={this.handleRadiusChange}
                    onRoomAmountChange={this.handleRoomAmountChange}
                    onSpeedChange={this.handleSpeedChange}
                    onVisualizeButtonClick={this.handleVisualizeButtonClick}
                    />
            </div>
        )
    }
}