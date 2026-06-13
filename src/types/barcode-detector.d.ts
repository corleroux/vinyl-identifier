interface BarcodeDetectorResult {
  rawValue: string
  format: string
}

interface BarcodeDetector {
  detect(source: ImageBitmapSource): Promise<BarcodeDetectorResult[]>
}

interface BarcodeDetectorConstructor {
  new (options?: { formats?: string[] }): BarcodeDetector
}

declare const BarcodeDetector: BarcodeDetectorConstructor | undefined
