Z_Array_1 = [
    [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7],
    [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7],
    [2, 0], [2, 1], [2, 2], [0, 0], [2, 4], [2, 5], [2, 6], [2, 7],
    [3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6], [3, 7],
    [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7],
    [5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5], [5, 6], [5, 7],
    [6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [6, 6], [6, 7],
    [7, 0], [7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6], [7, 7]
]

HighestX = 0
HighestY = 0
pairs = []


for sublist in Z_Array_1:
    for i in range(len(sublist) - 1):
        x, y = sublist[i], sublist[i + 1]
        pairs.append((x, y))
        if x > HighestX:
            HighestX = x
        if y > HighestY:
            HighestY = y
        print(f"X {x}, Y {y}")

print(f"Highest X: {HighestX}, Highest Y: {HighestY}")

def create_2d_array(highest_x, highest_y, pairs):
    print(f"X Grid Pattern x{highest_y + 1}: {[0 for _ in range(highest_x + 1)]}")
    array = [[0 for _ in range(highest_x + 1)] for _ in range(highest_y + 1)]
    for x, y in pairs:
        print(f"Filling Grid X: {x}, Y: {y}")
        array[y][x] = 1
    return array
def print_current_array(array, step_name):
    print(f"\nArray after {step_name}:")
    for row in array:
        print(' '.join(map(str, row)))
    print("---------------------------------")

def fillInArray(highest_x, highest_y, source_array):
    result_array = [[0 for _ in range(highest_x + 1)] for _ in range(highest_y + 1)]
    
    # Start from the outer layer and move inward
    for layer in range(min(highest_x, highest_y) // 2 + 1):
        # Top edge (left to right)
        for x in range(layer, highest_x + 1 - layer):
            y = layer
            if source_array[y][x] == 1:
                result_array[y][x] = 1
        print_current_array(result_array, f"Layer {layer}")
        # Right edge (top to bottom)
        for y in range(layer, highest_y + 1 - layer):
            x = highest_x - layer
            if source_array[y][x] == 1:
                result_array[y][x] = 1j
        print_current_array(result_array, f"Layer {layer}")
        # Bottom edge (right to left)
        for x in range(highest_x - layer, layer - 1, -1):
            y = highest_y - layer
            if source_array[y][x] == 1:
                result_array[y][x] = 1
        print_current_array(result_array, f"Layer {layer}")
        # Left edge (bottom to top)
        for y in range(highest_y - layer, layer - 1, -1):
            x = layer
            if source_array[y][x] == 1:
                result_array[y][x] = 1
        print_current_array(result_array, f"Layer {layer}")
        print(f"\nLayer {layer} completed:")
        print_current_array(result_array, f"Layer {layer}")

    return result_array
# Main execution
array_2d = create_2d_array(HighestX, HighestY, pairs)
print("\nOriginal Array:")
for row in array_2d:
    print(' '.join(map(str, row)))

filled_array = fillInArray(HighestX, HighestY, array_2d)
print("\nFilled Array:")
for row in filled_array:
    print(' '.join(map(str, row)))



