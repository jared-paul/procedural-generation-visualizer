import React from 'react';
import { Nav, Button, Row, Col, Form } from 'react-bootstrap';
import classNames from 'classnames';

import "../../../components/sidebar/SideBar.css";

import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';

/**
 * Represents the options sidebar for the tinykeep algorithm
 */
export default class TinyKeepOptions extends React.Component {

    constructor(props) {
      super(props);
      this.handleRoomWidthChange = this.handleRoomWidthChange.bind(this);
      this.handleRoomHeightChange = this.handleRoomHeightChange.bind(this);
      this.handleStdDeviationChange = this.handleStdDeviationChange.bind(this);
      this.handleRadiusChange = this.handleRadiusChange.bind(this);
      this.handleRoomAmountChange = this.handleRoomAmountChange.bind(this);
      this.handleSpeedChange = this.handleSpeedChange.bind(this);
      this.handleVisualizeButtonClick = this.handleVisualizeButtonClick.bind(this);

      this.state = {
        isOpen: false,
        isMobile: true,
      }

      this.previousWidth = -1;
    }

    //updates the width of the sidebar based on dimensions of screen
    //hides it on mobile
    updateWidth() {
      const width = window.innerWidth;
      const mobileLimit = 576;
      
      const isMobile = width <= mobileLimit;
      const wasMobile = this.previousWidth <= mobileLimit;

      if (isMobile !== wasMobile) {
        this.setState({
          isOpen: !isMobile
        });
      }
    }

    componentDidMount() {
      this.updateWidth();
      window.addEventListener("resize", this.updateWidth.bind(this));
    }

    componentWillUnmount() {
      window.removeEventListener("resize", this.updateWidth.bind(this));
    }

    //gets the current value of the slider for room width
    //and sets the room width for the next visualization
    handleRoomWidthChange(roomWidth) {
      this.props.onRoomWidthChange(roomWidth);
    }

    //gets the current value of the slider for room height
    //and sets the room height for the next visualization
    handleRoomHeightChange(roomHeight) {
      this.props.onRoomHeightChange(roomHeight);
    }

    //gets the current value of the slider for standard deviation
    //and sets the standard deviation for the next visualization
    handleStdDeviationChange(stdDeviation) {
      this.props.onStdDeviationChange(stdDeviation);
    }

    //gets the current value of the slider for spawn radius
    //and sets the radius for the next visualization
    handleRadiusChange(radius) {
      this.props.onRadiusChange(radius);
    }

    //gets the current value of the slider for room amount
    //and sets the room amount for the next visualization
    handleRoomAmountChange(roomAmount) {
      this.props.onRoomAmountChange(roomAmount);
    }

    //gets the current value of the slider for simulation speed
    //and sets the speed for the next visualization
    handleSpeedChange(speed) {
      this.props.onSpeedChange(speed);
    }

    //resets and starts the next visualization
    handleVisualizeButtonClick() {
      this.props.onVisualizeButtonClick();
    }

    //renders the actual options sidebar associated with the tinykeep algorithm
    render() {
      let roomWidth = Number.parseFloat(this.props.roomWidth);
      let roomHeight = Number.parseFloat(this.props.roomHeight);
      let stdDeviation = Number.parseFloat(this.props.stdDeviation);
      let radius = Number.parseFloat(this.props.radius);
      let roomAmount = Number.parseFloat(this.props.roomAmount);
      let speed = Number.parseFloat(this.props.speed);

      return (
        <div className={classNames("options-sidebar", { "is-open": this.state.isOpen })}>
          <div className="sidebar-header">
            <Button
              variant="link"
              onClick={this.props.toggle}
              style={{ color: "#fff" }}
              className="mt-4"
            >
            </Button>
            <h3 style={{textAlign: "center"}}>TinyKeep Options</h3>
          </div>
          <div>
            <Form> 
              <Form.Group as={Row}>
                <Form.Label column sm='5' style={{paddingLeft: '30px'}}>
                  Room Width
                </Form.Label>
                <Col sm='5'>
                  <RangeSlider
                    value={roomWidth}
                    onChange={e => this.handleRoomWidthChange(e.target.value)}
                    tooltip='off'
                  />
                </Col>
                <Form.Label column sm='1' style={{paddingLeft: '0px'}}>
                  {roomWidth}
                </Form.Label>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm='5' style={{paddingLeft: '30px'}}>
                  Room Height
                </Form.Label>
                <Col sm='5'>
                  <RangeSlider
                    value={roomHeight}
                    onChange={e => this.handleRoomHeightChange(e.target.value)}
                    tooltip='off'
                  />
                </Col>
                <Form.Label column sm='1' style={{paddingLeft: '0px'}}>
                  {roomHeight}
                </Form.Label>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm='5' style={{paddingLeft: '30px'}}>
                  Standard Deviation
                </Form.Label>
                <Col sm='5'>
                  <RangeSlider
                    value={stdDeviation}
                    onChange={e => this.handleStdDeviationChange(e.target.value)}
                    tooltip='off'
                  />
                </Col>
                <Form.Label column sm='1' style={{paddingLeft: '0px'}}>
                  {stdDeviation}
                </Form.Label>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm='5' style={{paddingLeft: '30px'}}>
                  Spawn Radius
                </Form.Label>
                <Col sm='5'>
                  <RangeSlider
                    value={radius}
                    onChange={e => this.handleRadiusChange(e.target.value)}
                    tooltip='off'
                  />
                </Col>
                <Form.Label column sm='1' style={{paddingLeft: '0px'}}>
                  {radius}
                </Form.Label>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm='5' style={{paddingLeft: '30px'}}>
                  Room Amount
                </Form.Label>
                <Col sm='5'>
                  <RangeSlider
                    value={roomAmount}
                    onChange={e => this.handleRoomAmountChange(e.target.value)}
                    tooltip='off'
                    max={50}
                  />
                </Col>
                <Form.Label column sm='1' style={{paddingLeft: '0px'}}>
                  {roomAmount}
                </Form.Label>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm='5' style={{paddingLeft: '30px'}}>
                  Simulation Speed
                </Form.Label>
                <Col sm='5'>
                  <RangeSlider
                    value={speed}
                    onChange={e => this.handleSpeedChange(e.target.value)}
                    tooltip='off'
                    max={2}
                    step={0.1}
                  />
                </Col>
                <Form.Label column sm='1' style={{paddingLeft: '0px'}}>
                  {speed}
                </Form.Label>
              </Form.Group>
            </Form>
            <div className="text-center">
              <Button 
                className="visualize-button"
                onClick={this.handleVisualizeButtonClick}
              >
                Visualize
              </Button>
            </div>
          </div>
        </div>
      );  
    }
}