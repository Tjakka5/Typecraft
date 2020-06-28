import Face from "./face";

export default class Block {
    faces: Face[] = [];

    constructor(faces: Face[]) {
        this.faces = faces; 
    }
}