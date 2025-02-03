import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import matplotlib.animation as animation
from CanceOutTest import test_array, analyze_array

class CancelVisualizer:
    def __init__(self, array_3d):
        self.array_3d = array_3d
        self.fig = plt.figure(figsize=(15, 10))
        self.ax = self.fig.add_subplot(111, projection='3d')
        self.layer_colors = ['blue', 'green', 'red', 'orange', 'cyan', 'magenta', 'yellow']
    def check_full_connections(self, x, y, layer_index):
        if layer_index == 0 or layer_index == len(self.array_3d) - 1:
            return False, {}
            
        layer = self.array_3d[layer_index]
        neighbors = {
            'right': [x+1, y], 
            'left': [x-1, y],
            'up': [x, y+1], 
            'down': [x, y-1]
        }
        
        connection_status = {
            'same_layer': {k: n in layer for k,n in neighbors.items()},
            'above': [x, y] in self.array_3d[layer_index + 1],
            'below': [x, y] in self.array_3d[layer_index - 1]
        }
        
        is_connected = (all(connection_status['same_layer'].values()) and 
                    connection_status['above'] and 
                    connection_status['below'])
                    
        return is_connected, connection_status
    def plot_layer(self, layer_index):
        layer = self.array_3d[layer_index]
        layer_color = self.layer_colors[layer_index % len(self.layer_colors)]
        

        connected_points = set()
        for coord in layer:
            x, y = coord
            is_connected, _ = self.check_full_connections(x, y, layer_index)
            if is_connected:
                connected_points.add((x, y))
        

        for coord in layer:
            x, y = coord
            z = layer_index
            is_connected = (x, y) in connected_points
            point_color = 'purple' if is_connected else layer_color
            
            self.ax.scatter([x], [y], [z], c=point_color, s=100)
            self.ax.text(x, y, z, f'({x},{y})', size=8)
            
            if layer_index > 0 and [x, y] in self.array_3d[layer_index-1]:
                below_connected = False
                if layer_index > 1: 
                    below_connected = self.check_full_connections(x, y, layer_index-1)[0]
                connection_color = 'purple' if (is_connected or below_connected) else layer_color
                self.ax.plot([x, x], [y, y], [z-1, z], 
                        '-', color=connection_color, alpha=0.5)
            
            if layer_index < len(self.array_3d)-1 and [x, y] in self.array_3d[layer_index+1]:
                above_connected = False
                if layer_index < len(self.array_3d)x-2: 
                    above_connected = self.check_full_connections(x, y, layer_index+1)[0]
                connection_color = 'purple' if (is_connected or above_connected) else layer_color
                self.ax.plot([x, x], [y, y], [z, z+1], 
                        '-', color=connection_color, alpha=0.5)
                
            neighbors = [(x+1, y), (x-1, y), (x, y+1), (x, y-1)]
            for nx, ny in neighbors:
                if [nx, ny] in layer:
                    neighbor_connected = (nx, ny) in connected_points
                    line_color = 'purple' if (is_connected or neighbor_connected) else layer_color
                    self.ax.plot([x, nx], [y, ny], [z, z], 
                            '-', color=line_color, alpha=0.5)
        
    
    def visualize(self):
        self.ax.clear()
        
        for i in range(len(self.array_3d)):
            self.plot_layer(i)
        
        self.ax.set_xlabel('X')
        self.ax.set_ylabel('Y')
        self.ax.set_zlabel('Z (Layer)')
        self.ax.set_title('3D Visualization with Connection Analysis')
        
        self.ax.set_xlim(1, 5)
        self.ax.set_ylim(1, 5)
        self.ax.set_zlim(-1, len(self.array_3d))
        
        plt.show()
def main():
    visualizer = CancelVisualizer(test_array)
    visualizer.visualize()

if __name__ == "__main__":
    main()