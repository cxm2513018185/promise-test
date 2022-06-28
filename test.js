const Promise = require('./promise.js');

const p = new Promise((resolve, reject) => {
  resolve(new Promise((_resolve, _reject) => {
    _resolve('hhhh')
  }))
});

const p1 = p.then((res) => {
  console.log('res: ', res);
  return new Promise((resolve, reject) => {
    resolve('0000')
  })

}, (err) => {
  console.log('err: ', err);

});

const p2 = p1.then((res2) => {
  console.log('res2: ', res2);
  return 888

}, (err2) => {
  console.log('err2: ', err2);

})
p2.then((res3) => {
  console.log('res3: ', res3);
})
