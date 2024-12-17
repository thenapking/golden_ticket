let d = 30

let w = 30*d
let h = 14.5*d
let bw = d*1.5
let bbw = d/5

var polygons 
var grid
let delaunay
let voronoi 
let r = d

let LEFT_EDGE = bw + bbw; 
let TOP_EDGE = bw + bbw;
let RIGHT_EDGE = w - bw - bbw ;
let BOTTOM_EDGE = h - bw - bbw;
let tbw = 5*d
let tbh = 4.075*d


function setup() {
  createCanvas(w, h, SVG);
  noLoop();
}

function draw() {
  background(255);
  blendMode(BLEND)

  

  draw_pattern(true)
  // draw_laves()
  draw_borders()
  main_text()
  

  draw_outline_borders()
  draw_guidelines()


}

function main_text(){
  push()
    translate(-0.5,-2)
    push()
      fill(255)
      // noStroke()
      translate(0, d/16)
      rect(tbw, tbh, w - 2*tbw + 1, h - 2*tbh)
    pop()


    translate(0,-5)
    fill(0)
    textSize(45)
    text("BACH", d*5.5+3, h/2-d/2)
    textSize(10)
    text("St. Matthew Passion", d*5.5 + 6, h/2+2)
    textSize(8)
    text("BWV 244", d*5.5 + 7, h/2+d)
    text("03-04-2025 19:00", d*5.5 + 7, h/2+d*1.5)
    text("Royal Festival Hall", d*5.5 + 7, h/2+d*2)
    text("Seats: G-34, G-35", d*5.5 + 7, h/2+d*2.5)
    text("Happy Christmas Ralph", d*5.5 + 7, h/2+d*3)
  pop()
}

function draw_pattern(extra = false){
  grid = hexagonal_grid(0,0,d,50)

  delaunay = d3.Delaunay.from(grid);
  voronoi = delaunay.voronoi([0, 0, w, h])

  push()
    stroke(0)
    noFill()
    
    draw_voronoi();
    if(extra) {
      translate(d/2,-vertical_spacing(d)/3)
      draw_voronoi();
    }
    translate(0,-vertical_spacing(d)/3)
    draw_voronoi();

  pop()

}

function draw_laves(){
  grid = n_agon_grid(0,0,d*3.37,15,8,false) // laves
  grid = n_agon_grid(0,0,d*3.37,12,12,false) // laves


  delaunay = d3.Delaunay.from(grid);
  voronoi = delaunay.voronoi([0, 0, w, h])

  push()
    translate(-3.75,-3.75)
    stroke(0)
    noFill()
    
    draw_voronoi();
  pop()

}

function draw_borders(){
  push()
    fill(255)
    noStroke()
    let pbx = 0
    rect(0,0,w+1,bw)
    rect(0,0,bw+pbx,h)
    rect(w-bw,0,bw,h)
    rect(0,h-bw,w,bw)
  pop()
}

function draw_outline_borders(){
  push()
    noFill()
    stroke(0)

    let pbx = d/2
    let obw = bw - pbx

    rect(bw, bw, w - bw * 2, h - bw * 2)
    rect(obw, obw, w - obw * 2, h - obw * 2)
    rect(obw + bbw, obw - bbw, w - obw * 2 - bbw * 2, h - obw * 2 + bbw * 2)

  pop()
}

function hexagonal_grid(x, y, r, l) {
  var points = [];
  for (var j = 0; j < l; j++) {
    const li = (j % 2 == 0 ? l : l - 1); // Odd rows have fewer points
    for (var i = 0; i < li; i++) {
      var xi = x + i * r;
      var yj = y + j * vertical_spacing(r);
      if (j % 2 == 0) {
        xi = xi - r / 2; // Shift even rows
      }
      points.push([xi, yj]);
    }
  }
  return points;
}

function vertical_spacing(r) {
  return Math.sqrt(3) * r / 2;
}


function n_agon_grid(x,y,r,l,n=12,offset=true) {
  // take a hexagonal grid and put a decagon of points at each centre 
  // and you will get the dual of the decagon grid = triakis grid
  var points = []
  const lj = l*2

  for(var j=0;j<lj;j++) {
    const li = (j%2==0 ? l : l - 1)
    for(var i=0;i<li;i++){
      var xi = i*r
      var yj = j*r/2

      if(j%2==0) { 
        xi = xi-r/2;
      }


      var decagon = n_agon(xi, yj, r/3, n, offset)
      points = points.concat(decagon)

    }
  }
  return points
}

function draw_voronoi() {
  for (let polygon of voronoi.cellPolygons()) {
    beginShape();
    for (const v of polygon) {
      vertex(v[0], v[1]);
    }
    endShape();
  }
}

function n_agon(x0=0,y0=0,a,n=6,offset=false) {
  var points = [];
  var start = offset==true ? -180/n : 0
  for(var i=start;i<=360;i+=360/n){
    var x = Math.round(a*Math.sin(radians(i)) + x0 ) ;
    var y = Math.round(a*Math.cos(radians(i)) + y0 );
    points.push([x, y]);
  }
  
  return points
}

function draw_guidelines(){
  push()
    noFill()
    stroke(0,255,0)
    strokeWeight(1)
    for(var i=0;i < 5;i++){
      let ii = w/5
      line(i * ii, 0, i * ii, h)
    }

    for(var i=0;i < 3;i++){
      let ii = h/3
      line(0, i * ii, w, i * ii)
    }
  pop()
}

function keyPressed() {
  if (key == 's' || key == 'S') save(`golden-ticket.svg`);
}
