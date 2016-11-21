
(function () {
    //修正babel ie10 無法 call class constructor
    var testObject: any = {};

    if (!(Object.setPrototypeOf || testObject.__proto__)) {
        var nativeGetPrototypeOf = Object.getPrototypeOf;

        Object.getPrototypeOf = function (object) {
            if (object.__proto__) {
                return object.__proto__;
            } else {
                return nativeGetPrototypeOf.call(Object, object);
            }
        }
    }

    //對陣列物件 數值型欄位做加總
    if (Array.prototype.sum === undefined) {
        Array.prototype.sum = function (func) {
            const _this: Array<any> = this;
            //console.log('func', func)
            let get_sum = _this
                .map<number>(func)
                .reduce((pre: number, cur: number) => {
                    //console.log('check', 'reduce', pre, cur);
                    if (cur !== undefined && cur !== null && cur.toString() != '')
                        return pre + cur;
                    else
                        return pre;
                }, 0)

            //console.log('get_sum', get_sum)
            return get_sum;
        };
    }

    //對浮點數值型 取小數位數 
    if (Number.prototype.floatSpot === undefined) {
        Number.prototype.floatSpot = function (pos) {
            if (this !== undefined && this !== null) {
                let size = Math.pow(10, pos);
                return Math.round(this * size) / size;
            }
        }
    }

    //除數 
    if (Number.prototype.divisor === undefined) {
        Number.prototype.divisor = function (num) {
            if (this != undefined && this !== null && num) {
                return this / num;
            }
        }
    }
})();
