import { DIRECTIONS, OBJECT_TYPE } from "./setup.js";

//Primitive random move of ghost
export function randomMovement(position, direction, objectExist) {
    let dir = direction;
    let nextMovePos = position + dir.movement;
    //Create an array from the directions object keys
    const keys = Object.keys(DIRECTIONS);

    while (
        objectExist(nextMovePos, OBJECT_TYPE.WALL) ||
        objectExist(nextMovePos, OBJECT_TYPE.GHOST)
    ) {
        //Get random key from key array
        const key = keys[Math.floor(Math.random() * keys.length)];
        //Set next new direction
        dir = DIRECTIONS[key];
        //Set next move
        nextMovePos = position + dir.movement;
    }
    return { nextMovePos, direction: dir };
}