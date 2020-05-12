
export function getRandomPointInCircle(radius) {
    radius = radius == 0 ? 1 : radius;

    let t = 2 * Math.PI * Math.random();
    let u = Math.random() + Math.random();
    let r;

    if (u > 1) {
        r = 2 - u;
    } else {
        r = u;
    }

    return [Math.round(radius * r * Math.cos(t)), Math.round(radius * r * Math.sin(t))];
}

export function normalDistribution(x) {
    return Math.pow(Math.E,-Math.pow(x,2)/2)/Math.sqrt(2*Math.PI);
}

export default { getRandomPointInCircle, normalDistribution }