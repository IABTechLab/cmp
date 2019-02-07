import { Probability } from './probability';

const counter = [0, 0, 0];

const probabilitilized = Probability([
  {
    p: '30%',
    f() {
      counter[0]++;
    },
  },
  {
    p: '10%',
    f() {
      counter[1]++;
    },
  },
  {
    p: '60%',
    f() {
      counter[2]++;
    },
  },
]);

describe('Probability', () => {
  it('should handle probability correctly', () => {
    for (let i = 0; i < 101; i++) {
      probabilitilized();
    }
    expect(counter[0] < counter[2]).toBeTruthy();
    expect(counter[1] < counter[0]).toBeTruthy();
    expect(counter[1] < counter[2]).toBeTruthy();
    expect(counter[2] > counter[1]).toBeTruthy();
    expect(counter[2] > counter[0]).toBeTruthy();
  });
});
