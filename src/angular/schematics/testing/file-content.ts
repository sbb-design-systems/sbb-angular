import { Tree } from '@angular-devkit/schematics';

/** Gets the content of a specified file from a schematic tree. */
export function getFileContent(tree: Tree, filePath: string): string {
  const contentBuffer = tree.read(filePath);

  if (!contentBuffer) {
    throw new Error(`Cannot read "${filePath}" because it does not exist.`);
  }

  return contentBuffer.toString();
}
