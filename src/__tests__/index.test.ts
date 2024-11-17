import {test, expect, vi} from 'vitest';
import {createEvent} from '../index.js';

test('trigger calls handler', () => {
    const [listen, trigger] = createEvent<string>();
    const handler = vi.fn((value: string) => value);
    listen(handler);
    trigger('test');
    expect(handler).toHaveBeenCalledWith('test');
});

test('derive listener', () => {
    const [listen, trigger] = createEvent<number>();
    const nextListen = listen(value => value + 1);
    const handler = vi.fn((value: number) => value);
    nextListen(handler);
    trigger(0);
    expect(handler).toHaveBeenCalledWith(1);
});
