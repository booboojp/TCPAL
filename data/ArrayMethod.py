import random
from typing import List, Union
import time


def checkInputValidConnections(array: List[List[Union[List[Union[int, float]], List[Union[int, float]]]]]) -> bool:
    for subarray in array:
        source_coords = subarray[0] 
        connections = subarray[1]   
        
        if len(source_coords) != 3 or len(connections) != 6:
            return False
            
        x, y, z = source_coords
        valid_positions = {
            (x + 1, y, z),  
            (x - 1, y, z), 
            (x, y + 1, z),  
            (x, y - 1, z), 
            (x, y, z + 1),  
            (x, y, z - 1)   
        }
        
        
        connection_positions = set()
        for i in range(0, len(connections), 3):
            if i + 2 >= len(connections):
                return False
            pos = (connections[i], connections[i+1], connections[i+2])
            connection_positions.add(pos)
        

        if len(connection_positions) != 6 or not connection_positions.issubset(valid_positions):
            return False
            
    return True
def create_arrays_based_on_size(coords):
    result = []
    for i in range(len(coords)):
        if random.random() < 0.20:  
            first_array = [random.randint(1, 400) for _ in range(3)]
            second_array = [random.randint(1, 400) for _ in range(18)]
        else:
            case = random.randint(1, 3)
            if case == 1:
                first_array = [random.randint(1, 400) for _ in range(random.randint(1, 5))]
                second_array = [random.randint(1, 400) for _ in range(18)]
            elif case == 2:
                first_array = [random.randint(1, 400) for _ in range(3)]
                second_array = [random.randint(1, 400) for _ in range(random.randint(10, 25))]
            else:
                first_array = [random.randint(1, 400) for _ in range(3)]
                second_array = [random.randint(1, 400) for _ in range(17)] + ['invalid']

        result.append([first_array, second_array])
    return result
def checkInputValidSize(size: int) -> bool:
    return isinstance(size, int) and size == 6


def checkInputValidData(array: List[Union[List[Union[int, float]], List[Union[int, float]]]]) -> bool:
    if len(array) != 2:
        return False    
    first_array, second_array = array
    if len(first_array) != 3 or not all(isinstance(x, (int, float)) for x in first_array):  
        return False
    if len(second_array) != 18 or not all(isinstance(x, (int, float)) for x in second_array):  
        return False
    return True

def checkAndRemovePoints(final_result, input_coords):
    removed_arrays_count = 0
    processed_result = []
    
    for array in final_result:
        center_point = array[0]  
        triangle_points = array[1] 
        

        triangle_pairs = [(triangle_points[i], triangle_points[i+1]) 
                         for i in range(0, len(triangle_points), 2)]
        

        remaining_pairs = []
        for pair in triangle_pairs:
            if list(pair) not in input_coords:
                remaining_pairs.extend(pair)
        
        if remaining_pairs:
            processed_array = [center_point, remaining_pairs]
            processed_result.append(processed_array)
        else:
            removed_arrays_count += 1
            
    return processed_result, removed_arrays_count

start_time = time.time()

testingArrayLength = random.randint(100, 2000)
input_coords = [[random.randint(1, 400) for _ in range(2)] for _ in range(testingArrayLength)]  
generated_arrays = create_arrays_based_on_size(input_coords)
total_arrays = len(generated_arrays)

valid_data = []
invalid_data_count = 0
for array in generated_arrays:
    if checkInputValidData(array):  
        valid_data.append(array)
    else:
        invalid_data_count += 1

final_result = []
invalid_size_count = 0
for array in valid_data:
    if checkInputValidSize(len(array[1])//3): 
        final_result.append(array)
    else:
        invalid_size_count += 1

processed_result, removed_arrays = checkAndRemovePoints(final_result, input_coords)
print(f"Arrays removed due to empty triangles: {removed_arrays}")
print(f"Final arrays after point removal: {len(processed_result)}")




end_time = time.time()
execution_time = end_time - start_time

time_str = str(execution_time)
decimal_part = time_str.split('.')[1]
last_nonzero = len(decimal_part.rstrip('0'))

print(f"\nArray Size: {testingArrayLength}")
print(f"Total arrays generated: {total_arrays}")
print(f"Arrays removed due to invalid data: {invalid_data_count}")
print(f"Arrays removed due to invalid size: {invalid_size_count}")
print(f"Final valid arrays: {len(final_result)}")
print(f"Execution time: {execution_time:.{last_nonzero}f} seconds")