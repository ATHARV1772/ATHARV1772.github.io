import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runOf, retime } from '../../src/lib/travel';

const train = { from: -1000, to: 2000, duration: 32000 };

test('a traveller can be moved along its run by changing the animation time', () => {
  assert.equal(retime(train, 16000, 300), 19200); // halfway, then 300 units on: 0.6 of the run
  assert.equal(retime(train, 16000, -1500), 0); // back to the very start
});

test('the time wraps like the looping animation does', () => {
  assert.equal(retime(train, 48000, 300), 19200); // the second loop, halfway through
  assert.equal(retime(train, -16000, 0), 16000);
});

test('a spot outside the run is refused rather than reached by jumping somewhere else', () => {
  assert.equal(retime(train, 16000, 1600), null);
  assert.equal(retime(train, 16000, -1600), null);
  assert.equal(retime({ from: 0, to: 0, duration: 1000 }, 0, 10), null);
});

test('the run is read from the animation itself', () => {
  const animation = {
    effect: {
      getKeyframes: () => [{ transform: 'translateX(-1300px)' }, { transform: 'translateX(1300px)' }],
      getTiming: () => ({ duration: 44000 }),
    },
  };
  assert.deepEqual(runOf(animation), { from: -1300, to: 1300, duration: 44000 });
  // Chrome hands the keyframes back as translate(), not translateX()
  const asChrome = { effect: { ...animation.effect, getKeyframes: () => [{ transform: 'translate(-1000px)' }, { transform: 'translate(2000px)' }] } };
  assert.deepEqual(runOf(asChrome), { from: -1000, to: 2000, duration: 44000 });
});
