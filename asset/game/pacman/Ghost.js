import { DIRECTIONS, OBJECT_TYPE } from "./setup.js";


class Ghost {

    /**
     * Create ghost
     * @param {*} speed of ghost
     * @param {*} startPos position when ghost appear
     * @param {*} movement ghost move by x/y
     * @param {*} name to distinguish ghosts
     */
    constructor(speed = 5, startPos, movement, name) {
        this.name = name;
        this.movement = movement;
        this.startPos = startPos;
        this.pos = startPos;
        this.dir = DIRECTIONS.ArrowRight;
        this.speed = speed;
        this.timer = 0;
        //True when pacman eat Powerpill
        this.isScared = false;
        this.rotation = false;
    }

    /**
     * Ghost move or not
     */
    shouldMove() {
        if (this.timer === this.speed) {
            this.timer = 0;
            return true;
        }
        this.timer++;
    }

    /**
     * Caculate next move of ghost
     * @param {*} objectExist touch wall or ghost lair do nothing
     * @returns new Position
     */
    getNextMove(objectExist) {
        const { nextMovePos, direction } = this.movement(
            this.pos,
            this.dir,
            objectExist
        );
        return { nextMovePos, direction };
    }


    /**
     * Do next move of Pacman
     */
    makeMove() {
        const classesToRemove = [OBJECT_TYPE.GHOST, OBJECT_TYPE.SCARED, this.name];
        let classesToAdd = [OBJECT_TYPE.GHOST, this.name];

        if (this.isScared) classesToAdd = [...classesToAdd, OBJECT_TYPE.SCARED];

        return { classesToRemove, classesToAdd };
    }

    /**
     * Set new position of ghost
     * @param {*} nextMovePos new position
     * @param {*} direction rotate by x/y
     */
    setNewPos(nextMovePos, direction) {
        this.pos = nextMovePos;
        this.dir = direction;
    }
}

export default Ghost;