export interface Feature {
    criticity: Criticity;
    description?: string,
    features?: {
        [key: string]: Feature
    }
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