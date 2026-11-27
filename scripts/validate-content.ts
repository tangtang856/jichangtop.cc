/**
 * scripts/validate-content.ts
 * TypeScript 镜像版本
 */
import fs from 'fs';
import path from 'path';

interface ValidationResult {
  file: string;
  errors: string[];
}

export function validateAll(): ValidationResult[] {
  return [];
}
