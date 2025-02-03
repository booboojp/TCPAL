export const mock3DArrayExport = Object.freeze([
    // Base layer - foundation
    [
        [2, 2], [2, 3], [2, 4],
        [3, 2], [3, 4],
        [4, 2], [4, 3], [4, 4]
    ],
    // Second layer - walls
    [
        [2, 2], [2, 4],
        [4, 2], [4, 4]
    ],
    // Third layer - doors and windows
    [
        [2, 2], [4, 2],
        [3, 3]
    ],
    // Fourth layer - roof
    [
        [1, 3], [2, 4], [3, 5], [4, 4], [5, 3]
    ],
]);
