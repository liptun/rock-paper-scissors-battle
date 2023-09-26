import {
  BoxGeometry,
  ConeGeometry,
  DodecahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  OctahedronGeometry,
  Vector3,
} from "three";

export class Entity extends Mesh {
  constructor({ x, y, z }: Vector3 = new Vector3()) {
    super();
    this.position.set(x, y + 0.5, z);
    const arrowGeometry = new ConeGeometry(0.2, 1.2, 4);
    const arrowMaterial = new MeshBasicMaterial({ color: "red" });
    const arrow = new Mesh(arrowGeometry, arrowMaterial);
    arrow.rotation.x = Math.PI / 2;
    arrow.position.y = 2;
    this.add(arrow);
  }
  update(renderList: Array<Entity>) {
    const nearestTarget = renderList
      .map((element) => ({
        distance: this.position.distanceTo(element.position),
        object: element,
      }))
      .sort((a, b) => (a.distance < b.distance ? -1 : 1))
      .shift();
    if (nearestTarget && nearestTarget.distance > 0.1) {
      this.lookAt(nearestTarget.object.position);
      const direction = new Vector3();
      nearestTarget.object.getWorldPosition(direction);
      direction.sub(this.position);
      direction.normalize();

      this.position.addScaledVector(direction, 0.05);
    }
  }
}

export class Rock extends Entity {
  constructor(position?: Vector3) {
    super(position);
    this.material = new MeshStandardMaterial({ color: "blue" });
    this.geometry = new DodecahedronGeometry(0.5, 0);
  }
}

export class Paper extends Entity {
  constructor(position?: Vector3) {
    super(position);
    this.material = new MeshStandardMaterial({ color: "green" });
    this.geometry = new BoxGeometry(1, 1, 0.1);
  }
}

export class Scisors extends Entity {
  constructor(position?: Vector3) {
    super(position);
    this.material = new MeshStandardMaterial({ color: "red" });
    this.geometry = new OctahedronGeometry(0.5, 0);
  }
}
