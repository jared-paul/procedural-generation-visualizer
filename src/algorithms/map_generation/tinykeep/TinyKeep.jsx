import React from "react";
import ReactDOM from "react-dom";
import Matter, { Events, Composite } from "matter-js";
import CustomRender from '../../../physics/CustomRender';

import tinykeep, { getIntersectingRooms, getHallways, getRoom } from "./TinykeepAlgorithm"

import Promise from 'bluebird';

import { steps } from './TinyKeepConstants';

/**
 * Represents the actual tinykeep algorithm visualization
 */
class TinyKeep extends React.Component {
  constructor(props) {
    super(props);

    Promise.config({
      cancellation: true
    })

    this.promises = [];
  }

  //creates all objects shared between each visualization
  //starts the visualization if it's the first time rendering
  componentDidMount() {
    this.engine = Matter.Engine.create({
      positionIterations: 10,
      enableSleeping: true
    });
    this.engine.world.gravity.y = 0;
    this.engine.timing.timeScale = 0.1;

    this.customRender = CustomRender.create({
      element: this.refs.scene,
      engine: this.engine,
      options: {
        showSleeping: false,
        width: window.innerWidth - 615,
        height: window.innerHeight - 20,
        wireframes: false
      }
    });

    Matter.Engine.run(this.engine);
    CustomRender.run(this.customRender);

    let roomWidth = this.props.roomWidth;
    let roomHeight = this.props.roomHeight
    let stdDeviation = this.props.stdDeviation;
    let radius = this.props.radius;
    let roomAmount = this.props.roomAmount;
    let speed = this.props.speed;
    let step = this.props.step;

    this.tinyKeepContext = tinykeep(this.engine.world, roomAmount, roomWidth, roomHeight, stdDeviation, radius, this.customRender.options.width, this.customRender.options.height);

    this.draw(this.tinyKeepContext, this.customRender, step);
  }

  //resets and starts the next visualization on update
  componentDidUpdate(prevProps) {
    if (this.props.reset === true) {
      this.props.onReset(); //calls back to set reset state back to false
    }
    if (prevProps.step !== this.props.step) {
      this.draw(this.tinyKeepContext, this.customRender, this.props.step); //if we are behind a step, let's render the current one
    }
  }

  //clears the canvas and physics world
  clearWorld(engine) {
    Matter.World.clear(engine.world);
    Matter.Engine.clear(engine);
  }

  //returns the current step of the algorithm
  getStep(step) {
    return steps[Object.keys(steps)[step]];
  }

  //increments the current step to render the next step
  incrementStep() {
    this.props.incrementStep();
  }

  //draws the current step onto the canvas
  draw(tinyKeepContext, render, step) {
    let engine = render.engine;
    let world = engine.world;
    let canvasContext = render.context;

    let bodies = Matter.Composite.allBodies(world);

    let rooms = tinyKeepContext.rooms;
    let mainRooms = tinyKeepContext.mainRooms;
    let triangles = tinyKeepContext.triangles;
    let triangleEdges = tinyKeepContext.triangleEdges;
    let minimumSpanningTree = tinyKeepContext.minimumSpanningTree;

    let roomWidth = this.props.roomWidth;
    let roomHeight = this.props.roomHeight
    let stdDeviation = this.props.stdDeviation;
    let radius = this.props.radius; //spawn radius
    let roomAmount = this.props.roomAmount;
    let speed = this.props.speed; //visualization speed

    let delay = 0;

    let stepString = this.getStep(step);
    if (stepString === steps.RESET) { //resets the current world and canvas
      Events.off(render);
      while (this.promises.length) { //cancels all currently scheduled tasks associated with the previous visualization
        this.promises.pop().cancel();
      }
      this.clearWorld(engine);
      CustomRender.stop(render);
      CustomRender.run(render); //restart the renderer
      
      //generates a new dungeon based on the algorithm
      this.tinyKeepContext = tinykeep(world, roomAmount, roomWidth, roomHeight, stdDeviation, radius, this.customRender.options.width, this.customRender.options.height);
      this.incrementStep();
    } else {
      switch (stepString) {
        case steps.SEPARATING_BODIES:
          let secondRun = false;

          //calls everytime the render is finished rendering the current frame
          Matter.Events.on(render, "afterRender", (event) => {
            let world = engine.world;
            let bodies = Composite.allBodies(world);
            let sleeping = bodies.filter((body) => body.isSleeping);
            let isWorldSleeping = bodies.length === sleeping.length;
    
            //once all of the bodies are separated from each other
            if (isWorldSleeping && secondRun === false) {
              secondRun = true;
              this.incrementStep();
            }
          });
          break;
        case steps.MAIN_ROOMS:
          delay = this.drawMainRooms(speed, mainRooms, 'white');

          //after a delay based on speed, go to the next step
          this.sleep(delay / speed).then(() => {
            this.promises.shift(); //deletes this promise since it's done

            this.incrementStep(); 
          })
          break;
        case steps.TRIANGULATION:
          CustomRender.stop(render); //steps the render because we need to draw on the canvas
          delay = this.drawTriangulation(speed, canvasContext, triangles, mainRooms);

          this.sleep(delay / speed).then(() => {
            this.promises.shift();

            this.incrementStep();
          })
          break;
        case steps.MINIMUM_SPANNING_TREE:
          CustomRender.clear(render); //clears the triangulation, but keeps the rooms
          delay = this.drawMinimumSpanningTree(speed, canvasContext, minimumSpanningTree, mainRooms);

          this.sleep(delay / speed).then(() => {
            this.promises.shift();

            this.incrementStep();
          })
          break;
        case steps.HALLWAYS:
          CustomRender.clear(render); //clears the triangulation, but keeps the rooms
          delay = this.drawHallways(speed, canvasContext, minimumSpanningTree, mainRooms, rooms);

          this.sleep(delay / speed).then(() => {
            this.promises.shift();

            this.incrementStep();
          })
          break;
        case steps.INTERSECTING_ROOMS:
          //gets the intersecting rooms after they are all separated by the physics engine
          let intersectingRooms = getIntersectingRooms(minimumSpanningTree, mainRooms, rooms); 
          delay = this.drawIntersectingRooms(intersectingRooms, 'blue');

          //for each room not included in the dungeon, hide them
          rooms.forEach((room) => {
            if (!intersectingRooms.includes(room) && !mainRooms.includes(room)) {
              room.body.render.visible = false;
            }
          })

          //redraw the hallways and bodies to make sure we only have what we need
          CustomRender.clear(render);
          this.drawHallwaysImmediate(canvasContext, minimumSpanningTree, mainRooms, rooms);
          CustomRender.bodies(render, bodies, canvasContext);

          this.sleep(delay / speed).then(() => {
            this.promises.shift();

            this.incrementStep();
          })
          break;
      }
    }
  }

  //visualizes the main rooms in the dungeon
  drawMainRooms(speed, mainRooms, colour) {
    let delay = 0;

    for (let room of mainRooms) {
      this.sleep(delay / speed).then(() => {
        this.promises.shift();

        room.body.render.fillStyle = colour;
      })
      delay += 250
    }

    return delay;
  }

  //draws the triangles connecting each main room together
  drawTriangulation(speed, context, triangles, mainRooms) {
    let delay = 0;

    let i = triangles.length;
    while (i > 0)
    {
      let path = new Path2D();

      i--;
      let firstRoom = mainRooms[triangles[i]];
      path.moveTo(firstRoom.body.position.x, firstRoom.body.position.y);
      
      i--;
      let secondRoom = mainRooms[triangles[i]];
      path.lineTo(secondRoom.body.position.x, secondRoom.body.position.y);

      i--;
      let thirdRoom = mainRooms[triangles[i]];
      path.lineTo(thirdRoom.body.position.x, thirdRoom.body.position.y);

      path.closePath();

      this.sleep(delay / speed).then(() => {        
        this.promises.shift();

        context.strokeStyle = 'black';
        context.stroke(path);
      });

      delay += 250;
    }
    
    return delay;
  }

  //draws the minimum connecting tree connecting all main rooms
  drawMinimumSpanningTree(speed, canvasContext, minimumSpanningTree, mainRooms) {
    let delay = 0;

    for (let i = 0; i < minimumSpanningTree.length; i++) {
      let edges = minimumSpanningTree[i];
      let firstRoom = mainRooms[edges[0]];
      let secondRoom = mainRooms[edges[1]];

      let path = new Path2D();
      path.moveTo(firstRoom.body.position.x, firstRoom.body.position.y);
      path.lineTo(secondRoom.body.position.x, secondRoom.body.position.y);
      path.closePath();

      this.sleep(delay / speed).then(() => {
        this.promises.shift();

        canvasContext.strokeStyle = 'red';
        canvasContext.stroke(path); 
      });

      delay += 250;
    }

    return delay;
  }

  //draws all of the hallways immediately (no draw delay)
  drawHallwaysImmediate(canvasContext, minimumSpanningTree, mainRooms, rooms) {
    getHallways(minimumSpanningTree, mainRooms).forEach((hallway) => {
      this.drawHallway(canvasContext, hallway, rooms, mainRooms);
    });
  }

  //draws all of the hallways connecting the rooms together 
  drawHallways(speed, canvasContext, minimumSpanningTree, mainRooms, rooms) {
    let delay = 0;

    getHallways(minimumSpanningTree, mainRooms).forEach((hallway) => {
      this.sleep(delay / speed).then(() => {
        this.promises.shift();

        this.drawHallway(canvasContext, hallway, rooms, mainRooms);
      });

      delay += 250;
    });

    return delay;
  }

  //draws a path onto the canvas
  drawHallway(canvasContext, path, rooms) {
    path.forEach((point) => {
      let x = point[0];
      let y = point[1];

      let room = getRoom(x, y, rooms);
      if (room === null) {
        canvasContext.fillStyle = 'orange';
        canvasContext.fillRect(x, y, 6, 6);
      }
    });
  }

  //visualizes the intersecting rooms that were found based on the hallways
  //can't be main rooms
  drawIntersectingRooms(intersectingRooms, colour) {
    intersectingRooms.forEach((room) => {
      room.body.render.fillStyle = colour;
    });
  }

  //delays the drawing for a time
  sleep(time) {
    let promise = new Promise((resolve) => setTimeout(resolve, time));
    this.promises.push(promise);
    return promise;
  }

  render() {
    return <div ref="scene"/>;
  }
}

export default TinyKeep;