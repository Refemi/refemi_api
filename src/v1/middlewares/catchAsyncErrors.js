/* Resolves promises and sends an error if promise cannot be solved */

module.exports = (resolver) => (request, result, next) => {
  return Promise.resolve(resolver(request, result, next)).catch(next);
};
