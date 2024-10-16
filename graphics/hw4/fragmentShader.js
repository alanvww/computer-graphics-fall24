const fragmentShader = `
#define OBJECTS_NUM 6

precision mediump float;

varying vec3 vPos;

uniform vec2 uResolution;
uniform float uTime;
uniform float uFocalLength;
uniform mat4 uA[OBJECTS_NUM], uB[OBJECTS_NUM], uC[OBJECTS_NUM];

const float PI = 3.14159265359;
const vec3 cameraPosition = vec3(0.0, 0., 5.0);
const float maxRenderingDistance = 100.;

const float airRefractiveIndex = 1.0;
const float objectRefractiveIndex = 1.5;

vec2 rayQ(vec3 V, vec3 W, mat4 Q) {
    vec4 V1 = vec4(V, 1.);
    vec4 W0 = vec4(W, 0.);
    
    float a = dot(W0, Q * W0);
    float b = dot(V1, Q * W0) + dot(W0, Q * V1);
    float c = dot(V1, Q * V1);
    
    float d = b * b - 4. * a * c;
    if (d < 0.) return vec2(-1., -1.);
    
    float t0 = (-b - sqrt(d)) / (2. * a);
    float t1 = (-b + sqrt(d)) / (2. * a);
    return vec2(t0, t1);
}

vec3 normalQuadric(vec3 P, mat4 Q) {
    vec4 P1 = vec4(P, 1.);
    vec3 N = (Q * P1 + P1 * Q).xyz;
    return normalize(N);
}

mat3 rayQ3(vec3 V, vec3 W, mat4 A, mat4 B, mat4 C, int inOut) {
    vec2 tA = rayQ(V, W, A);
    vec2 tB = rayQ(V, W, B);
    vec2 tC = rayQ(V, W, C);
    
    float tMin = max(max(tA.x, tB.x), tC.x);
    float tMax = min(min(tA.y, tB.y), tC.y);
    
    if (tMin > tMax || tMax < 0.0) return mat3(0.0);
    
    float t = inOut == 1 ? tMax : tMin;
    vec3 P = V + t * W;
    vec3 N = normalQuadric(P, A);
    
    return mat3(
        vec3(tMin, tMax, 0.0),
        P,
        N
    );
}

vec3 shade(vec3 V, vec3 W) {
    vec3 color = vec3(0.1); // Background color
    vec3 attenuation = vec3(1.0);
    const int MAX_BOUNCES = 5;

    for (int bounce = 0; bounce < MAX_BOUNCES; bounce++) {
        float t = maxRenderingDistance;
        int hitIndex = -1;
        mat3 hitInfo;

        // Unrolled loop for OBJECTS_NUM = 6
        {
            mat3 info = rayQ3(V, W, uA[0], uB[0], uC[0], 0);
            if (info[0].x > 0.0 && info[0].x < t) {
                t = info[0].x;
                hitIndex = 0;
                hitInfo = info;
            }
        }
        {
            mat3 info = rayQ3(V, W, uA[1], uB[1], uC[1], 0);
            if (info[0].x > 0.0 && info[0].x < t) {
                t = info[0].x;
                hitIndex = 1;
                hitInfo = info;
            }
        }
        {
            mat3 info = rayQ3(V, W, uA[2], uB[2], uC[2], 0);
            if (info[0].x > 0.0 && info[0].x < t) {
                t = info[0].x;
                hitIndex = 2;
                hitInfo = info;
            }
        }
        {
            mat3 info = rayQ3(V, W, uA[3], uB[3], uC[3], 0);
            if (info[0].x > 0.0 && info[0].x < t) {
                t = info[0].x;
                hitIndex = 3;
                hitInfo = info;
            }
        }
        {
            mat3 info = rayQ3(V, W, uA[4], uB[4], uC[4], 0);
            if (info[0].x > 0.0 && info[0].x < t) {
                t = info[0].x;
                hitIndex = 4;
                hitInfo = info;
            }
        }
        {
            mat3 info = rayQ3(V, W, uA[5], uB[5], uC[5], 0);
            if (info[0].x > 0.0 && info[0].x < t) {
                t = info[0].x;
                hitIndex = 5;
                hitInfo = info;
            }
        }

        if (hitIndex >= 0) {
            vec3 P = hitInfo[1];
            vec3 N = hitInfo[2];
            
            vec3 L = normalize(vec3(1., 1., -1.));
            float diffuse = max(dot(N, L), 0.);
            
            color += attenuation * vec3(0.2 + 0.8 * diffuse);
            
            vec3 R = reflect(W, N);
            
            vec3 T = refract(W, N, airRefractiveIndex / objectRefractiveIndex);
            
            if (T != vec3(0.0)) {
                mat3 exitInfo;
                if (hitIndex == 0) exitInfo = rayQ3(P, T, uA[0], uB[0], uC[0], 1);
                else if (hitIndex == 1) exitInfo = rayQ3(P, T, uA[1], uB[1], uC[1], 1);
                else if (hitIndex == 2) exitInfo = rayQ3(P, T, uA[2], uB[2], uC[2], 1);
                else if (hitIndex == 3) exitInfo = rayQ3(P, T, uA[3], uB[3], uC[3], 1);
                else if (hitIndex == 4) exitInfo = rayQ3(P, T, uA[4], uB[4], uC[4], 1);
                else exitInfo = rayQ3(P, T, uA[5], uB[5], uC[5], 1);

                if (exitInfo[0].y > 0.0) {
                    vec3 exitP = exitInfo[1];
                    vec3 exitN = -exitInfo[2]; // Flip normal for exiting
                    vec3 exitT = refract(T, exitN, objectRefractiveIndex / airRefractiveIndex);
                    if (exitT != vec3(0.0)) {
                        V = exitP + 0.001 * exitT;
                        W = exitT;
                        attenuation *= 0.8; // Reduce intensity slightly for refraction
                    } else {
                        V = exitP + 0.001 * reflect(T, exitN);
                        W = reflect(T, exitN);
                        attenuation *= 0.9;
                    }
                } else {
                    V = P + 0.001 * R;
                    W = R;
                    attenuation *= 0.5;
                }
            } else {
                V = P + 0.001 * R;
                W = R;
                attenuation *= 0.7;
            }
        } else {
            break;
        }
    }

    return color;
}
void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;
    vec3 W = normalize(vec3(uv, -uFocalLength));

    vec3 color = shade(cameraPosition, W);

    gl_FragColor = vec4(sqrt(color), 1.0);
}
`;