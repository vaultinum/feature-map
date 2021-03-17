export enum TestStatus {
    failed = "failed",
    passed = "passed",
    ignored = "ignored",
    notImplemented = "not-implemented"
}

export interface TestCase{
    name: string,
    status: TestStatus,
    executedAt?: Date,
    filePath?: string
}

export interface Feature {
    criticity: Criticity;
    description?: string,
    features?: {
        [key: string]: Feature
    },
    tests?: TestCase[]
}

export enum Criticity {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high"
}

export interface FeatureMap {
    productName: string, 
    description?: string,
    features: {
        [key: string]: Feature
    }
}
