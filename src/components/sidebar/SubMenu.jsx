import React from "react";
import { Accordion, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";

/**
 * Represents the sublist of the Map Generation heading
 */
export default class SubMenu extends React.Component {
  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  //sets the parent active and the child not active
  toggleParentHover = () => {
    this.setState({
      childHover: false,
      parentHover: !this.state.parentHover
    })
  }

  //sets the child active and the parent not active
  toggleChildHover = () => {
    this.setState({
      parentHover: false,
      childHover: !this.state.childHover
    })
  }
  
  //renders the actual list
  render() {
    const { icon, title, items } = this.props;

    return (
      <Nav.Item className={classNames({ open: !this.state.collapsed })}>
        <Accordion>
          <Accordion.Toggle
            as={Nav.Link}
            variant="link"
            eventKey="0"
            onClick={this.toggleNavbar}
            onMouseEnter={this.toggleParentHover}
            onMouseLeave={this.toggleParentHover}
            className={this.state.parentHover ? "hovered" : ""}
          >
            <FontAwesomeIcon icon={icon} className="mr-2" />
            {title}
            <FontAwesomeIcon
              icon={this.state.collapsed ? faCaretDown : faCaretUp}
              className="float-right"
            />
          </Accordion.Toggle>

          <Accordion.Collapse eventKey="0">
            <nav className="nav flex-column">
              {items.map(item => (
                <div className={this.state.childHover ? "hovered" : ""}>
                  <a
                    className={`nav-link nav-item pl-5 ${
                      item === "Active" ? "active" : ""
                    } `}
                    href="/"
                    key={item}
                    onMouseEnter={this.toggleChildHover}
                    onMouseLeave={this.toggleChildHover}
                  >
                    {item}
                  </a>
                </div>
              ))}
            </nav>
          </Accordion.Collapse>
        </Accordion>
      </Nav.Item>
    );
  }
}