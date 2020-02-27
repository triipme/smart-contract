// const FixedFeeScheme = artifacts.require("FixedFeeScheme");

// contract('FixedFeeScheme', (accounts) => {
//   it("should set minFee is 0.01 ether when init", () =>
//     FixedFeeScheme.deployed()
//       .then(instance => instance.minFee())
//       .then(result => {
//         assert.equal(
//           result.valueOf(),
//           web3.utils.toWei('0.01', 'ether'),
//           "0.01 ether was not"
//         );
//       }));

//   it("should change minFee when call setMinFee with 3 ether", () =>
//     FixedFeeScheme.deployed()
//       .then(instance => {
//         localInstance = instance
//         instance.setMinFee(web3.utils.toWei('3', 'ether'))
//       })
//       .then(() => localInstance.minFee())
//       .then(result => {
//         assert.equal(
//           result.valueOf().toString(),
//           web3.utils.toWei('3', 'ether'),
//           "3 ether was not"
//         );
//       }));

//   it("should return current minFee 0.01 ether when call estimateFee with 3 - ether", () =>
//     FixedFeeScheme.deployed()
//       .then(instance => instance.estimateFee(web3.utils.toWei('3', 'ether')))
//       .then(result => {
//         assert.equal(
//           result.valueOf(),
//           web3.utils.toWei('3', 'ether'),
//           "3 ether was not"
//         );
//       }));

//   it("should return current minFee 2 ether when call estimateFee with 3 - ether", () =>
//     FixedFeeScheme.deployed()
//       .then(instance => {
//         localInstance = instance
//         instance.setMinFee(web3.utils.toWei('2', 'ether'))
//       })
//       .then(() => localInstance.estimateFee(web3.utils.toWei('3', 'ether')))
//       .then(result => {
//         assert.equal(
//           result.valueOf().toString(),
//           web3.utils.toWei('2', 'ether'),
//           "2 ether was not"
//         );
//       }));
// });
