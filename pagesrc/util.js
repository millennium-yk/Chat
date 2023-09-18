export default class {
    static get(target) {
        return localStorage.getItem(target);
    };
    static set(target, val) {
        localStorage.setItem(target, val);
        return localStorage.getItem(target);
    };
    static reset(target) {
        localStorage.removeItem(target);
        return localStorage.getItem(target);
    };
    static getTime() {
        let date = new Date();
        return `${date.getHours() < 10 ? "0" + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`;
    };
}