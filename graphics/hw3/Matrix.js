// Alan Ren
// Computer Graphics Fall 2024
// Matrix class for 3D transformations


function Matrix() {
    this.identity = () => value = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

    this.translate = (x, y, z) => {
        value = multiply(value, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]);
    };

    this.rotateX = (theta) => {
        let c = Math.cos(theta), s = Math.sin(theta);
        value = multiply(value, [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]);

    };

    this.rotateY = (theta) => {
        let c = Math.cos(theta), s = Math.sin(theta);
        value = multiply(value, [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]);

    };

    this.rotateZ = (theta) => {
        let c = Math.cos(theta), s = Math.sin(theta);
        value = multiply(value, [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    };

    this.scale = (x, y, z) => {
        value = multiply(value, [x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1]);
    };

    this.perspective = (x, y, z) => {
        value = multiply(value, [1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1]);
    };

    this.transform = (vector) => {
        let result = [];
        for (let i = 0; i < 4; i++) {
            result[i] = value[i] * vector[0] + value[i + 4] * vector[1] +
                value[i + 8] * vector[2] + value[i + 12] * vector[3];
        }
        value = result;
    };

    this.get = () => value;
    this.set = v => value = v;

    let value = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

    let multiply = (a, b) => {
        let c = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                c[i + j * 4] = a[i] * b[j * 4] + a[i + 4] * b[j * 4 + 1] +
                    a[i + 8] * b[j * 4 + 2] + a[i + 12] * b[j * 4 + 3];
            }
        }
        return c;
    }
}
