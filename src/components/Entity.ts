import {
  BoxGeometry,
  ConeGeometry,
  DodecahedronGeometry,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  OctahedronGeometry,
  Vector3,
} from "three";

export type EntityType = "Rock" | "Paper" | "Scissors";

export class Entity extends Mesh {
  private targetType?: EntityType;
  private baseSpeed: number = 0.05;
  private speed: number = this.baseSpeed;

  constructor(
    { x, y, z }: Vector3 = new Vector3(),
    public entityType?: EntityType
  ) {
    super();
    this.castShadow = true;
    this.receiveShadow = true;
    this.baseSpeed = MathUtils.randFloat(0.05, 0.1);
    this.position.set(x, y + 0.5, z);
    //this.createDirectionArrow();
    switch (entityType) {
      case "Rock":
        this.makeRock();
        break;
      case "Paper":
        this.makePaper();
        break;
      case "Scissors":
        this.makeScissors();
        break;
    }
  }

  createDirectionArrow() {
    const geometry = new ConeGeometry(0.2, 1.2, 4);
    const material = new MeshBasicMaterial({ color: "red" });
    const arrow = new Mesh(geometry, material);
    arrow.rotation.x = Math.PI / 2;
    arrow.position.y = 2;
    this.add(arrow);
  }

  update(renderList: Array<Entity>) {
    const renderListEntities = renderList
      .map((element) => ({
        distance: this.position.distanceTo(element.position),
        object: element,
      }))
      .sort((a, b) => (a.distance < b.distance ? -1 : 1));

    const targetList = renderListEntities.filter(
      (el) => el.object.entityType === this.targetType
    );

    const ofKindList = renderListEntities.filter(
      (el) => el.object.entityType === this.entityType
    );

    const nearestTarget = targetList.shift();
    const nearestOfKind = ofKindList.splice(1,1).pop()

    if (nearestTarget && nearestTarget.distance > 0.99) {
      this.lookAt(nearestTarget.object.position);
      const nearestOfKindDistance = nearestOfKind ? nearestOfKind.distance : 1;
      if (nearestOfKindDistance >= 1) {
        this.translateZ(this.speed);
      } else {
        this.translateX(this.speed );
        this.translateZ(-this.speed / 10);
      }
    } else if (this.targetType === nearestTarget?.object.entityType) {
      this.speed = this.baseSpeed / 4;
      setTimeout(() => {
        this.speed = this.baseSpeed;
      }, 1000);

      if (targetList.length < 5) {
        this.speed = this.baseSpeed * 2;
      } else {
        this.speed = this.baseSpeed;
      }

      if (targetList.length > 1) {
        switch (nearestTarget?.object.entityType) {
          case "Rock":
            nearestTarget.object.makePaper();
            break;
          case "Paper":
            nearestTarget.object.makeScissors();
            break;
          case "Scissors":
            nearestTarget.object.makeRock();
            break;
        }
      } else if (nearestTarget) {
        nearestTarget.object.position.x = MathUtils.randFloatSpread(50);
        nearestTarget.object.position.z = MathUtils.randFloatSpread(50);
      }
    }
  }

  makeRock() {
    this.entityType = "Rock";
    this.targetType = "Scissors";
    this.material = new MeshStandardMaterial({ color: "blue" });
    this.geometry = new DodecahedronGeometry(0.5, 0);
  }

  makePaper() {
    this.entityType = "Paper";
    this.targetType = "Rock";
    this.material = new MeshStandardMaterial({ color: "green" });
    this.geometry = new BoxGeometry(1, 1, 0.1);
  }

  makeScissors() {
    this.entityType = "Scissors";
    this.targetType = "Paper";
    this.material = new MeshStandardMaterial({ color: "red" });
    this.geometry = new OctahedronGeometry(0.5, 0);
  }
}
