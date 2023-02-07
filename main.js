const createPoints = (n) => {
  const points = [];
  for (let index = 0; index < n; index++) {
    let point = [Math.random(), Math.random()];
    points.push(point);
  }
  return points;
};

const calculateDistance = (firstPoint, secondPoint) => {
  const eixoX = firstPoint[0] - secondPoint[0];
  const eixoY = firstPoint[1] - secondPoint[1];
  const distance = Math.sqrt(Math.pow(eixoX, 2) + Math.pow(eixoY, 2));
  return distance;
};

const getDistanceMatrix = (points) => {
  const matrix = points.map((point) => {
    const allPointDistances = [];
    for (let index = 0; index < points.length; index++) {
      let distance = calculateDistance(point, points[index]);
      if (distance === 0) {
        distance = Infinity;
      }
      allPointDistances.push(distance);
    }
    return allPointDistances;
  });
  return matrix;
};

const bruteForceMinPath = (points) => {
  const path = [];
  const distance = [];
  for (let index = 0; index < points.length; index++) {
    if (path.length === 0) {
      path.push(index);
    } else {
      path[0] = index;
    }
    distance.push(pathLoop(points.length, [...path], 0, 1));
  }
  return Math.min(...distance);
};

const pathLoop = (quantity, path, distance, position) => {
  if (path.length === quantity) {
    return distance;
  }
  const totalDistance = [];
  for (let index = 0; index < quantity; index++) {
    if (undefined === path.find((point) => point === index)) {
      if (path.length === position) {
        path.push(index);
      } else {
        path[position] = index;
      }
      const pointDistance = calculateDistance(
        points[path[position]],
        points[path[position - 1]]
      );
      totalDistance.push(
        pathLoop(quantity, [...path], distance + pointDistance, position + 1)
      );
    }
  }
  return Math.min(...totalDistance);
};

const generateMatrixMap = (matrix) => {
  const matrixMap = [];
  for (let index = 0; index < matrix.length - 1; index++) {
    for (let index1 = index + 1; index1 < matrix.length; index1++) {
      matrixMap.push([matrix[index][index1], index, index1]);
    }
  }
  return matrixMap.sort((a, b) => {
    return a[0] - b[0];
  });
};

const minPath = (line, quantity) => {
  const countPath = new Array(quantity).fill(0);
  const path = [];
  let count = 0;
  let group = 1;
  while (count < quantity * 2 - 2) {
    const dist = line.shift();
    const first = countPath[dist[1]];
    const second = countPath[dist[2]];
    console.log(dist, countPath, group);
    if (first !== Infinity && second !== Infinity) {
      if (first === 0 && second === 0) {
        countPath[dist[1]] = group;
        countPath[dist[2]] = group;
        path.push([dist[1], dist[2]]);
        count += 2;
        group += 1;
        continue;
      }
      if (first === 0) {
        countPath[dist[1]] = second;
        countPath[dist[2]] = Infinity;
        path.push([dist[1], dist[2]]);
        count += 2;
        continue;
      }
      if (second === 0) {
        countPath[dist[1]] = Infinity;
        countPath[dist[2]] = first;
        path.push([dist[1], dist[2]]);
        count += 2;
        continue;
      }
      if (first === second) {
        continue;
      }
      if (second !== 0 && first !== 0) {
        countPath[dist[1]] = Infinity;
        countPath[dist[2]] = Infinity;
        path.push([dist[1], dist[2]]);
        count += 2;
        countPath.forEach((value, index) => {
          if (value === second) {
            countPath[index] = first;
          }
        });
        continue;
      }
    }
  }
  return path;
};

const quantityOfPoints = 5;
const points = createPoints(quantityOfPoints);
const distance = bruteForceMinPath(points);
const matrixDistance = getDistanceMatrix(points);
const line = generateMatrixMap(matrixDistance);
const path = minPath([...line], quantityOfPoints);
let result = 0;
path.forEach((point) => {
  result += matrixDistance[point[0]][point[1]];
});
console.log(points, line, "result", path, distance - result);
