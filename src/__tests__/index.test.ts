import {test, expect, vi} from 'vitest';
import {createEvent} from '../index.js';

test('trigger calls handler', () => {
    const [on, emit] = createEvent<string>();
    const handler = vi.fn((value: string) => value);
    on(handler);
    emit('test');
    expect(handler).toHaveBeenCalledWith('test');
});

test('derive listener', () => {
    const [on, emit] = createEvent<number>();
    const nextOn = on(value => value + 1);
    const handler = vi.fn((value: number) => value);
    nextOn(handler);
    emit(0);
    expect(handler).toHaveBeenCalledWith(1);
});

test('remove listener', () => {
    const [listen, trigger] = createEvent<string>();
    const handler = vi.fn((value: string) => value);
    const off = listen(handler);
    off();
    trigger('test');
    expect(handler).not.toHaveBeenCalled();
});

test('remove derived listener', () => {
    const [on, emit] = createEvent<number>();
    const nextOn = on(value => value + 1);
    const handlerOn = vi.fn((value: number) => value);
    nextOn(handlerOn);
    const handlerOff = vi.fn((value: number) => value);
    const off = nextOn(handlerOff);
    off();
    emit(0);
    expect(handlerOn).toHaveBeenCalledWith(1);
    expect(handlerOff).not.toHaveBeenCalled();
});

test('top remove no effect', () => {
    const [on, emit] = createEvent<string>();
    const handler = vi.fn((value: string) => value);
    on(handler);
    emit('test');
    on();
    expect(handler).toHaveBeenCalledWith('test');
});
