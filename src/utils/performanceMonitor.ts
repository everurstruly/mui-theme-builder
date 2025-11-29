export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private measurements: Map<string, number[]> = new Map();

  private constructor() {}

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  measure<T>(name: string, operation: () => T): T {
    const start = performance.now();
    const result = operation();
    const duration = performance.now() - start;

    if (!this.measurements.has(name)) this.measurements.set(name, []);
    this.measurements.get(name)!.push(duration);

    if (duration > 50) {
      console.warn(`Slow operation ${name}: ${duration.toFixed(2)}ms`);
    }

    return result;
  }

  getStats(name: string) {
    const values = this.measurements.get(name) || [];
    const count = values.length;
    const avg = count ? values.reduce((a, b) => a + b, 0) / count : 0;
    const max = count ? Math.max(...values) : 0;
    return { avg, max, count };
  }
}

export function usePerformance() {
  return PerformanceMonitor.getInstance();
}
