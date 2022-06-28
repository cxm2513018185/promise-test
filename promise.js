const PENDING = 'pending';
const SUCCESS  = 'fulfilled';
const FAIL = 'rejected';

function resolvePromise(value, resolve, reject) {
  if (value instanceof Promise) {
    value.then(resolve, reject);
  } else {
    resolve(value);
  }
}

class Promise {
  constructor(executor) {
    this.status = PENDING; // 初始状态
    this.value = undefined; // 保存成功态的值
    this.reason = undefined; // 保存失败态的值
    this.onFulFilledCallbacks = []; // 存储成功的回调方法
    this.onRejectedCallbacks = []; // 存储失败的回调方法

    const resolve = (value) => {
      if (value instanceof Promise) {
        value.then(resolve, reject);
      }
      
      if (this.status === PENDING) {
        this.status = SUCCESS;
        this.value = value;

        if (this.onFulFilledCallbacks.length) {
          this.onFulFilledCallbacks.forEach((callback) => callback());
        }
      }
    }

    const reject = (reason) => {
      if (this.status === PENDING) {
        this.status = FAIL;
        this.reason = reason;
        
        if (this.onRejectedCallbacks.length) {
          this.onRejectedCallbacks.forEach((callback) => callback());
        }
      }
    }

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error)
    }
  }

  then(onFulFilled, onRejected) {
    // 定义一个新的Promise实现链式调用
    const newPromise = new Promise((resolve, reject) => {
      const resolveFulFilled = () => {
        const v = onFulFilled(this.value);
        resolvePromise(v, resolve, reject);
      }
      const resolveRejected = () => {
        const v = onRejected(this.reason);
        resolvePromise(v, resolve, reject);
      }

      if (this.status === SUCCESS) {
        resolveFulFilled();
      }
      if (this.status === FAIL) {
        resolveRejected();
      }
      if (this.status === PENDING) {
        this.onFulFilledCallbacks.push(() => {
          resolveFulFilled();
        });
        this.onRejectedCallbacks.push(() => {
          resolveRejected();
        });
      }
    })
    return newPromise;
  }
}

module.exports = Promise;