// Alan Ren
// Computer Graphics Fall 2024
// Matrix library


    const identity = () => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

    const translation = (x, y, z) => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1];


    const rotationX = (theta) => [1, 0, 0, 0, 0, Math.cos(theta), Math.sin(theta), 0, 0, -Math.sin(theta), Math.cos(theta), 0, 0, 0, 0, 1];

    const rotationY = (theta) => [Math.cos(theta), 0, -Math.sin(theta), 0, 0, 1, 0, 0, Math.sin(theta), 0, Math.cos(theta), 0, 0, 0, 0, 1];

    const rotationZ = (theta) => [Math.cos(theta), Math.sin(theta), 0, 0, -Math.sin(theta), Math.cos(theta), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

    const transpose = (matrix) => {
        let newMatrix = []
        for (let row = 0; row < 4; row++) {
          for (let col = 0; col < 4; col++) {
            const index = col * 4 + row;
            const transposedIndex = row * 4 + col;
            newMatrix[transposedIndex] = matrix[index];
          }
        }
        return newMatrix;
      };

    const scale = (x, y, z) => [x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1];


    const multiply = (a, b) => {
        let c = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                c[i + j * 4] = a[i] * b[j * 4] + a[i + 4] * b[j * 4 + 1] +
                    a[i + 8] * b[j * 4 + 2] + a[i + 12] * b[j * 4 + 3];
            }
        }
        return c;
    }
