import { describe, it, expect } from 'vitest';

function asyncSum(a, b) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(a + b);
    }, 1000);
  });
}

describe('TDD basic', () => {
  it('works', () => {
    expect(Math.sqrt(16)).toBe(4);
    expect(Math.sqrt(16)).not.toBe(3);
  });

  it('works on async function', async () => {
    const sum = await asyncSum(100, 200);
    expect(sum).toBe(300);
  });
});
