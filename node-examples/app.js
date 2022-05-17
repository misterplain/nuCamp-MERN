const rect = require("./rectangle");

function solveRect(l, w) {
  console.log(`solving for rectangle with dimensions ${l}, ${w}`);
  rect(l, w, (err, rectangle) => {
    if (err) {
      console.log("ERRPR" + err.message);
    } else {
      console.log(
        `rectangle area with dimensions ${l} and ${w}: ${rectangle.area()}`
      );
      console.log(
        `rectangle perimeter  with dimensions ${l} and ${w}:: ${rectangle.perimeter()}`
      );
    }
  });
  console.log("this statement is logged after the call to rect()")
}


//still able to reun other code while the error funcitinos are finishing
solveRect(2, 4);
solveRect(3, 5);
solveRect(0, 5);
solveRect(5, -3);
