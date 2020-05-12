import Matter from "matter-js";
import physics from "../../../physics/physics"
import kruskal from '../../../physics/kruskal';
var Delaunay = require('../../../physics/delaunay');

/**
 * Represents all the steps associated with the tinykeep algorithm
 */

 //exports the dungeon created by the algorithm
export default function tinyKeep(physicsWorld, roomAmount, roomWidth, roomHeight, stdDeviation, radius, width, height) {
    roomAmount = Number.parseFloat(roomAmount);
    roomWidth = Number.parseFloat(roomWidth);
    roomHeight = Number.parseFloat(roomHeight);
    stdDeviation = Number.parseFloat(stdDeviation);
    radius = Number.parseFloat(radius);

    let rooms = generateRooms(physicsWorld, roomAmount, roomWidth, roomHeight, stdDeviation, radius, width, height);
    let areaThreshold = getAreaThreshold(rooms);
    let mainRooms = getMainRooms(rooms, areaThreshold);
    
    let centerPoints = getCenterPoints(mainRooms);
    let triangles = Delaunay.triangulate(centerPoints);
    let triangleEdges = getEdgesFromTriangulation(triangles);
    let minimumSpanningTree = kruskal(centerPoints, triangleEdges, metric_dist);

    return {
      rooms: rooms,
      mainRooms: mainRooms,
      triangles: triangles,
      triangleEdges: triangleEdges,
      minimumSpanningTree: minimumSpanningTree,
    }
}

//generates all the rooms in the dungeon
function generateRooms(physicsWorld, amount, roomWidth, roomHeight, stdDeviation, radius, canvasWidth, canvasHeight) {
    let rooms = [];

    for (let i = 0; i < amount; i++) {
        let room = generateRoom(physicsWorld, roomWidth, roomHeight, stdDeviation, radius, canvasWidth, canvasHeight);
        rooms.push(room);
    }

    return rooms;
}

//generates a single room and adds it to the physics world
function generateRoom(physicsWorld, roomWidth, roomHeight, stdDeviation, radius, canvasWidth, canvasHeight) {
    let position = physics.getRandomPointInCircle(radius);
    let width = 40 + Math.round(Math.random() * (roomWidth + stdDeviation));
    let height = 40 + Math.round(Math.random() * (roomHeight + stdDeviation));

    let roomBody = Matter.Bodies.rectangle(position[0] + canvasWidth / 2, position[1] + canvasHeight / 2, width, height);
    roomBody.sleepThreshold = 120;
    Matter.World.addBody(physicsWorld, roomBody);

    let room = {
        x: position[0],
        y: position[1],
        width: width,
        height: height,
        area: width * height,
        body: roomBody
    }

    return room;
} 

//calculates the distance between two points
function metric_dist( a, b )
{
  var dx = a[0] - b[0];
  var dy = a[1] - b[1];
  return dx*dx + dy*dy;
}

//gets the area threshold for rooms to become main rooms
function getAreaThreshold(rooms) {
    let areaThreshold = 0;

    rooms.forEach((room) => {
        areaThreshold += room.area;
    })

    return areaThreshold / rooms.length;
}

//returns all of the main rooms out of the rooms based on the area threshold
function getMainRooms(rooms, areaThreshold) {
    let selectedRooms = [];

    rooms.forEach((room) => {
        if (room.area >= areaThreshold) {
            selectedRooms.push(room);
        }
    });

    return selectedRooms;
}

//returns the centerpoints of the rooms (always the main rooms) given
function getCenterPoints(mainRooms) {
    let centerPoints = [];

    mainRooms.forEach((room) => {
        centerPoints.push([room.body.position.x, room.body.position.y]);
    })

    return centerPoints;
}

//returns all the triangle edges from the delaunay triangulation
function getEdgesFromTriangulation(triangles) {
    let edges = [];

    for (let i = triangles.length; i;) {
      --i;
      var c = triangles[i];
      --i;
      var b = triangles[i];
      --i;
      var a = triangles[i];
  
      edges.push([a, b]);
      edges.push([b, c]);
      edges.push([c, a]);
    }

    return edges;
}

//returns all of the paths between the main rooms
export function getHallways(minimumSpanningTree, mainRooms) {
  let hallways = []

  for (let i = 0; i < minimumSpanningTree.length; i++) {
    let edges = minimumSpanningTree[i];
    let firstRoom = mainRooms[edges[0]];
    let secondRoom = mainRooms[edges[1]];

    let path = getPath(firstRoom, secondRoom);
    hallways.push(path);
  }

  return hallways;
}

//returns the intersecting rooms based on the minimum spanning tree
export function getIntersectingRooms(minimumSpanningTree, mainRooms, rooms) {
    let intersectingRooms = [];

    for (let i = 0; i < minimumSpanningTree.length; i++) {
        let edge = minimumSpanningTree[i];
        let firstRoom = mainRooms[edge[0]];
        let secondRoom = mainRooms[edge[1]];

        let path = getPath(firstRoom, secondRoom);
        let intersections = getIntersectionsAlongPath(path, mainRooms, rooms);
        intersections.forEach((room) => {
          intersectingRooms.push(room);
        })
    }

    return intersectingRooms;
}

//gets all of the intersecting rooms along a path
function getIntersectionsAlongPath(path, mainRooms, rooms) {
    let intersections = [];

    path.forEach((point) => {
        let room = getRoom(point[0], point[1], rooms);
        if (room !== null && !intersections.includes(room) && !mainRooms.includes(room)) {
            intersections.push(room);
        }
    })

    return intersections;
}

//deterministic way to determine the path between two rooms
function getPath(firstRoom, secondRoom) {
    let points = [];

    let yMin = Math.min(firstRoom.body.position.y, secondRoom.body.position.y);
    let yMax = Math.max(firstRoom.body.position.y, secondRoom.body.position.y);

    let xMin = Math.min(firstRoom.body.position.x, secondRoom.body.position.x);
    let xMax = Math.max(firstRoom.body.position.x, secondRoom.body.position.x);

    if (Math.random()) {
      for (let x = xMin; x < xMax; x++) {
        points.push([x, firstRoom.body.position.y]);
      }

      for (let y = yMin; y < yMax; y++) {
        points.push([secondRoom.body.position.x, y])
      }
    } else {
      for (let y = yMin; y < yMax; y++) {
        points.push([secondRoom.body.position.x, y])
      }

      for (let x = xMin; x < xMax; x++) {
        points.push([x, firstRoom.body.position.y]);
      }
    }

    return points;
}

//returns a room if found at the point given, null if not found
export function getRoom(x, y, rooms) {
    for (const room of rooms) {
      if (Matter.Vertices.contains(room.body.vertices, { x: x, y: y })) {
        return room;
      }
    }

    return null;
}