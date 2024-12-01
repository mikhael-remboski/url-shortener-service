import RequestContext from './request-context';

describe('RequestContext', () => {
  it('should create a unique instance', () => {
    const instance1 = RequestContext.getInstance();
    const instance2 = RequestContext.getInstance();

    expect(instance1).toBe(instance2);
  });

  it('should initialize with a valid UUID tid', () => {
    const instance = RequestContext.getInstance();
    const tidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    expect(instance.data.tid).toMatch(tidPattern);
  });

  it('should reset the context with a new tid and headers', () => {
    const instance = RequestContext.getInstance();
    const oldTid = instance.data.tid;

    const newHeaders = { 'Content-Type': 'application/json' };
    instance.reset(newHeaders);

    expect(instance.data.tid).not.toBe(oldTid);
    expect(instance.data.headers).toEqual(newHeaders);
  });

  it('should reset the context with an empty headers object by default', () => {
    const instance = RequestContext.getInstance();

    instance.reset();

    expect(instance.data.headers).toEqual({});
  });
});
