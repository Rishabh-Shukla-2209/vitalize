import '@testing-library/jest-dom/vitest'

// ResizeObserver mock
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};

// PointerEvent mock (often needed for Radix)
if (!global.PointerEvent) {
    class PointerEvent extends Event {
        height: number;
        isPrimary: boolean;
        pointerId: number;
        pointerType: string;
        pressure: number;
        tangentialPressure: number;
        tiltX: number;
        tiltY: number;
        twist: number;
        width: number;

        constructor(type: string, params: PointerEventInit = {}) {
            super(type, params);
            this.pointerId = params.pointerId || 0;
            this.width = params.width || 0;
            this.height = params.height || 0;
            this.pressure = params.pressure || 0;
            this.tangentialPressure = params.tangentialPressure || 0;
            this.tiltX = params.tiltX || 0;
            this.tiltY = params.tiltY || 0;
            this.pointerType = params.pointerType || "";
            this.isPrimary = params.isPrimary || false;
            this.twist = params.twist || 0;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.PointerEvent = PointerEvent as any;
}
