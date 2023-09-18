export default class {
    constructor(ue) {
        this.dataView = ue,
            this.index = 0,
            this.maxIndex = ue.byteLength
    };
    readUInt8() {
        const ue = this.dataView.getUint8(this.index, !0);
        return this.index++,
            ue
    };
    readInt8() {
        const ue = this.dataView.getInt8(this.index, !0);
        return this.index++,
            ue
    };
    readUInt16() {
        const ue = this.dataView.getUint16(this.index, !0);
        return this.index += 2,
            ue
    };
    readInt16() {
        const ue = this.dataView.getInt16(this.index, !0);
        return this.index += 2,
            ue
    };
    readUInt32() {
        const ue = this.dataView.getUint32(this.index, !0);
        return this.index += 4,
            ue
    };
    readInt32() {
        const ue = this.dataView.getInt32(this.index, !0);
        return this.index += 4,
            ue
    };
    readFloat32() {
        const ue = this.dataView.getFloat32(this.index, !0);
        return this.index += 4,
            ue
    };
    readFloat64() {
        const ue = this.dataView.getFloat64(this.index, !0);
        return this.index += 8,
            ue
    };
    readUTF8string() {
        let ue = '';
        for (; !this.endOfBuffer();) {
            const fe = this.readUInt8();
            if (0 === fe)
                break;
            ue += String.fromCharCode(fe)
        }
        return ue
    };
    readEscapedUTF8string() {
        const ue = this.readUTF8string();
        return decodeURIComponent(escape(ue))
    };
    decompress() {
        const ue = new Uint8Array(this.dataView.buffer)
            , fe = this.readUInt32()
            , he = new Uint8Array(fe);
        LZ4.decodeBlock(ue.slice(5), he),
            this.dataView = new DataView(he.buffer),
            this.index = 0,
            this.maxIndex = this.dataView.byteLength
    };
    endOfBuffer() {
        return this.index >= this.maxIndex
    };
};