export function Probability(args) {
  const probas = [];
  const functions = [];

  let sum = 0;

  args.push({
    p: 0,
    f() {}
  });

  args.forEach(({ p, f }, i) => {
    if (/%/.test(p)) {
      p = Math.abs(parseFloat(p)) / 100.0;
    }

    if (isNaN(p) || typeof f !== "function") {
      throw new TypeError(
        `Probability.js: Invalid probability object in argument ${i}.`
      );
    }

    sum += p;

    if (sum > 1.0) {
      throw new TypeError(
        'Probability.js: Probability exceeds "1.0" (=100%) in argument ' +
					i +
					': p="' +
					p +
					'" (=' +
					p * 100 +
					'%), sum="' +
					sum +
					'" (=' +
					sum * 100 +
					"%)."
      );
    }

    probas[i] = sum;
    functions[i] = f;
  });

  return function probabilitilized() {
    const random = Math.random();
    let i = 0;
    let l = probas.length - 1;
    for (i; i < l && random >= probas[i]; i++) {
      /* intentionally left empty */
    }
    return functions[i].apply(this, args);
  };
}
