module.exports = {
  cellValues: {
    empty: 0,
    filled: 1,
    start: 2,
    end: 3,
  },
  
  numberOfRows: 4,
  numberOfColumns: 7,

  // Define directions for moving up, down, left, and right.
  directions: [
    [-1, 0], // Up
    [1, 0], // Down
    [0, -1], // Left
    [0, 1], // Right
  ],
};
