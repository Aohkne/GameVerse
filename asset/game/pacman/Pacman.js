import { OBJECT_TYPE, DIRECTIONS } from "./setup.js";


class Pacman {

    /**
     * Create Pacman
     * @param {*} speed of Pacman
     * @param {*} startPos Start position
     */
    constructor(speed, startPos) {
        this.pos = startPos;
        this.speed = speed;
        this.dir = null;
        this.timer = 0;
        this.powerPill = false;
        this.rotation = true;
    }
    /**
     * PacMan move or not
     */
    shouldMove() {
        if (!this.dir) return;

        //cho pacman di chuyển
        if (this.timer === this.speed) {
            this.timer = 0;
            return true;
        }
        this.timer++;
    }


    /**
     * Caculate next move of Pacman
     * @param {*} objectExist touch wall or ghost lair do nothing
     * @returns new Position
     */
    getNextMove(objectExist) {
        //varible movement in setup.js
        let nextMovePos = this.pos + this.dir.movement;

        //if pacman touch wall or ghost lair then set pos = current
        if (
            objectExist(nextMovePos, OBJECT_TYPE.WALL) ||
            objectExist(nextMovePos, OBJECT_TYPE.GHOSTLAIR)
        ) {
            nextMovePos = this.pos;
        }

        return { nextMovePos, direction: this.dir };
    }


    /**
     * Do next move of Pacman
     */
    makeMove() {
        //remove pacman at current position to new one
        const classesToRemove = [OBJECT_TYPE.PACMAN];
        const classesToAdd = [OBJECT_TYPE.PACMAN];

        return { classesToRemove, classesToAdd };
    }

    /**
     * Set new position of pacman
     * @param {*} nextMovePos new position
     */
    setNewPos(nextMovePos) {
        this.pos = nextMovePos;
    }

    /**
     *  Handle the input of object
     * @param {*} e event appear
     * @param {*} objectExist object
     */
    handleKeyInput = (e, objectExist) => {
        let dir;


        //get key code by pressing button
        // 37 & 40 is left right arrow in index.js
        if (e.keyCode >= 37 && e.keyCode <= 40) {
            //change direction
            dir = DIRECTIONS[e.key];
        } else {
            return;
        }

        const nextMovePos = this.pos + dir.movement;
        //touch wall do nothing
        if (objectExist(nextMovePos, OBJECT_TYPE.WALL) ||
            objectExist(nextMovePos, OBJECT_TYPE.GHOSTLAIR)) return;
        this.dir = dir;
    }
}

export default Pacman;