export default class {
    constructor(size) {
        this.dataView = new DataView(new ArrayBuffer(size)),
            this.byteOffset = 0
    };
    writeUint8(value) {
        this.dataView.setUint8(this.byteOffset++, value)
    };
    writeInt32(value) {
        this.dataView.setInt32(this.byteOffset, value, true),
            this.byteOffset += 4
    };
    writeUint32(value) {
        this.dataView.setUint32(this.byteOffset, value, true),
            this.byteOffset += 4
    };
    writeString(string) {
        for (let i = 0; i < string.length; i++) this.writeUint8(string.charCodeAt(i));
        this.writeUint8(0)
    };
};