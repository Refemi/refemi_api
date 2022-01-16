module.exports = (resolver) => (request, result, next) => {
  return Promise
    .resolve(resolver(request, result, next))
    .catch(next);
};
