/**
 * Adapted from: https://github.com/abetusk/kruskal.js
 */

import UnionFind from './union-find';

export default function kruskal( vertices, edges, metric ) { 
  var set = {};

  var finalEdge = [];

  var forest = new UnionFind( vertices.length );

  var edgeDist = [];
  for (var ind in edges)
  {
    var u = edges[ind][0];
    var v = edges[ind][1];
    var e = { edge: edges[ind], weight: metric( vertices[u], vertices[v] ) };
    edgeDist.push(e);
  }

  edgeDist.sort( function(a, b) { return a.weight- b.weight; } );

  for (var i=0; i<edgeDist.length; i++)
  {
    var u = edgeDist[i].edge[0];
    var v = edgeDist[i].edge[1];

    if ( forest.find(u) != forest.find(v) )
    {
      finalEdge.push( [ u, v ] );
      forest.link( u, v );
    }
  }

  return finalEdge;

}