import { AppContext } from './request-context';

describe('RequestContext', () => {
  it('should create a unique instance', () => {
    const instance1 = AppContext.getInstance().getContext();
    const instance2 = AppContext.getInstance().getContext();

    expect(instance1).toBe(instance2);
  });
});
