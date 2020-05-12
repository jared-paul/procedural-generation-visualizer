import React from 'react';
import { Nav, Button } from 'react-bootstrap';
import classNames from 'classnames';

import SubMenu from "./SubMenu"
import "./SideBar.css";

/**
 * Represents the two sidebar components of the webpage
 */
export default class SideBar extends React.Component {

    constructor(props) {
      super(props);

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

    //renders the actual sidebar
    render() {
      return (
        <div className={classNames("sidebar", { "is-open": this.state.isOpen })}>
          <div className="sidebar-header">
            <h3>Procedural Generation</h3>
          </div>
          <Nav className="flex-column pt-2">
            <p className="ml-3">Algorithms</p>
  
            <SubMenu
              title="Map Generation"
              items={["Tinykeep"]}
            />

            {/* <SubMenu
              title="Sequence Generation"
              items={[]}
            />

            <SubMenu
              title="Ontogenetic"
              items={[]}
            />

            <SubMenu
              title="Teleological"
              items={[]}
            /> */}
            <p className="ml-3 footer">
              By: Jared Paul
            </p>
          </Nav>
        </div>
      );  
    }
}