import numpy as np

status_symbols = {
    True: '[+]',
    False: '[-]'
}

def convert_to_3d_array(coord_lists):
    max_x = max(x for layer in coord_lists for x, _ in layer)
    max_y = max(y for layer in coord_lists for _, y in layer)
    array_3d = np.zeros((len(coord_lists), max_x + 1, max_y + 1), dtype=bool)
    for z, layer in enumerate(coord_lists):
        for x, y in layer:
            array_3d[z, x, y] = True
    return array_3d

def check_neighbors(coord, layer_index, array_3d):
    x, y = coord
    z = layer_index
    
    z_max, x_max, y_max = array_3d.shape
    if x == 0 or x >= x_max-1 or y == 0 or y >= y_max-1 or z == 0 or z >= z_max-1:
        return {
            'right': False, 'left': False, 'up': False, 'down': False,
            'above': False, 'below': False, 'can_cancel': False
        }

    results = {
        'right': array_3d[z, x+1, y],
        'left': array_3d[z, x-1, y],
        'up': array_3d[z, x, y+1],
        'down': array_3d[z, x, y-1],
        'above': array_3d[z+1, x, y],
        'below': array_3d[z-1, x, y]
    }
    
    results['can_cancel'] = all(results.values())
    return results

def analyze_array(coord_lists):
    array_3d = convert_to_3d_array(coord_lists)
    cancelable_coords = []
    
    for z_index in range(1, len(coord_lists)-1):
        print(f"\n=== Analyzing Layer {z_index} ===")
        layer_cancelable = []
        layer = coord_lists[z_index]
        
        for coord in layer:
            print(f"\nChecking coordinate [{coord[0]}, {coord[1]}]:")
            results = check_neighbors(coord, z_index, array_3d)
            
            print(f"    Right Neighbor: {status_symbols[results['right']]} {[coord[0]+1, coord[1]] if results['right'] else ''}")
            print(f"    Left Neighbor:  {status_symbols[results['left']]} {[coord[0]-1, coord[1]] if results['left'] else ''}")
            print(f"    Up Neighbor:    {status_symbols[results['up']]} {[coord[0], coord[1]+1] if results['up'] else ''}")
            print(f"    Down Neighbor:  {status_symbols[results['down']]} {[coord[0], coord[1]-1] if results['down'] else ''}")
            
            if results['above']:
                print(f"    Above Layer:    {status_symbols[results['above']]} [{coord[0]}, {coord[1]}] at Z={z_index+1}")
            else:    
                print(f"    Above Layer:    {status_symbols[results['above']]}")
            
            if results['below']:
                print(f"    Below Layer:    {status_symbols[results['below']]} [{coord[0]}, {coord[1]}] at Z={z_index-1}")
            else:
                print(f"    Below Layer:    {status_symbols[results['below']]}")
            print(f"    Can be canceled: {status_symbols[results['can_cancel']]} ({results['can_cancel']})")
            
            if results['can_cancel']:
                layer_cancelable.append(coord)
                cancelable_coords.append((coord[0], coord[1], z_index))
        
        print(f"\nLayer {z_index} Summary:")
        if layer_cancelable:
            print(f"+ Cancelable coordinates: {layer_cancelable}")
        else:
            print("- No cancelable coordinates")
    
    print("\n=== FINAL ANALYSIS ===")
    print(f"Total cancelable coordinates: {len(cancelable_coords)}")
    print(f"Coordinates that can be canceled: {cancelable_coords}")


test_array = [
    [[2, 2], [2, 3], [2, 4],
     [3, 2], [3, 3], [3, 4],
     [4, 2], [4, 3], [4, 4]],
    [[2, 2], [2, 3], [2, 4],
     [3, 2], [3, 3], [3, 4],
     [4, 2], [4, 3], [4, 4]],
    
    [[2, 2], [2, 3], [2, 4],
     [3, 2], [3, 3], [3, 4],
     [4, 2], [4, 3], [4, 4]]
]

if __name__ == "__main__":
    analyze_array(test_array)