export class GeometryUtils {
	static distaceBetweenTwoPoints(point1: { x: number; y: number }, point2: { x: number; y: number }) {
		return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
	}
}
