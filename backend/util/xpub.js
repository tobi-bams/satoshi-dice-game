const X_Pub_Key = (privateKey, pathDerivation) => {
  const child = privateKey.derivePath(pathDerivation).neutered();
  const xpub = child.toBase58();
  return xpub;
};

module.exports = {
  X_Pub_Key,
};
