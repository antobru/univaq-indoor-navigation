 import { Injectable } from '@angular/core';
// import * as turf from "@turf/turf";
// import { Feature, Coord, Polygon, Units, Properties } from '@turf/helpers'


// @Injectable({
//   providedIn: 'root'
// })
// export class MatterportService {

//   constructor() { }

//   getPosition() {
//     let options: any = { steps: 100, units: "meters", properties: { foo: 'bar' } };
//     let radius = 5;
//     let circles = [
//       turf.circle([0, 0], radius, options),
//       turf.circle([1, 1], radius, options),
//       turf.circle([-1, -1], radius, options),
//       turf.circle([3, 3], radius, options),
//     ]
//     let polygon = circles[0];
//     for(let circle of circles.slice(1)) {
//       let intersect = turf.intersect(polygon, circle);
//       polygon = intersect;
//     }

//     let coords = turf.centroid(polygon).geometry;
//     return coords.coordinates;
//   }

//   ptIsInCircle(pt,circle){
//     var dx=pt.x-circle.x;
//     var dy=pt.y-circle.y;
//     var r=circle.r+1; // allow circle 1px expansion for rounding
//     return(dx*dx+dy*dy<=r*r);
//   }

// }


// var A={x:0,y:0,r:200,color:"rgba(52, 152, 219,0.5)"};
// var B={x:0,y:400,r:250,color:"rgba(46, 204, 113,0.5)"};
// var C={x:300,y:200,r:280,color:"rgba(241, 196, 15,0.5)"};

// var intersections=[];
// var AB=circleIntersections(A,B);
// var BC=circleIntersections(B,C);
// var CA=circleIntersections(C,A);
// if(AB){intersections=intersections.concat(AB);}
// if(BC){intersections=intersections.concat(BC);}
// if(CA){intersections=intersections.concat(CA);}

// var triangle=[];
// for(var i=0;i<intersections.length;i++){
//   var pt=intersections[i];
//   if(ptIsInCircle(pt,A) && ptIsInCircle(pt,B) && ptIsInCircle(pt,C)){
//     triangle.push(pt);
//   }
// }

// drawMap();

// if(triangle.length==3){
//   ctx.beginPath();
//   ctx.moveTo(triangle[0].x,triangle[0].y);
//   ctx.lineTo(triangle[1].x,triangle[1].y);
//   ctx.lineTo(triangle[2].x,triangle[2].y);
//   ctx.closePath();
//   ctx.stroke();
// }


// function drawCircle(c){
//   ctx.fillStyle = c.color;
//   ctx.beginPath();
//   ctx.arc(c.x,c.y,c.r, 0, Math.PI*2, true);
//   ctx.closePath();
//   ctx.fill();
// }

// // intersection points of 2 circles
// function circleIntersections(c0,c1) {
//   var x0=c0.x;
//   var y0=c0.y;
//   var r0=c0.r;
//   var x1=c1.x;
//   var y1=c1.y;
//   var r1=c1.r;

//   // calc circles' proximity
//   var dx = x1 - x0;
//   var dy = y1 - y0;
//   var d = Math.sqrt((dy*dy) + (dx*dx));

//   // return if circles do not intersect. 
//   if (d > (r0 + r1)) { return; }
//   // return if one circle is contained in the other 
//   if (d < Math.abs(r0 - r1)) { return; }

//   // calc the 2 intersection points
//   var a = ((r0*r0) - (r1*r1) + (d*d)) / (2.0 * d) ;
//   var x2 = x0 + (dx * a/d);
//   var y2 = y0 + (dy * a/d);
//   var h = Math.sqrt((r0*r0) - (a*a));
//   var rx = -dy * (h/d);
//   var ry = dx * (h/d);
//   var xi = x2 + rx;
//   var xi_prime = x2 - rx;
//   var yi = y2 + ry;
//   var yi_prime = y2 - ry;

//   return([ {x:xi,y:yi}, {x:xi_prime,y:yi_prime} ]);
// }

// function 