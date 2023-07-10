# vast-challenge-mini1
This is a project code about vast challenge mini1.

**How this project code works:**

Open cmd, enter the code folder, enter python -m http.server, open the browser and enter localhost:8000



We mainly use D3 to visualize in html, combined with python to process and analyze data.

1. how we choose the starting point

    1. We must first analyze the abnormal nodes, and then analyze the characteristics of the abnormal nodes by induction to provide help for subsequent judgments of other entities. In order to analyze the abnormal nodes, we combined the weight attribute, counted the number of nodes corresponding to different types of edges, obtained 9-dimensional data, calculated the distance between each node and the mean value through the Mahalanobis distance measurement method, and established the mapping of distance and color The relationship is visualized with circular, and we judge abnormal nodes by observing the color depth.

    2. At the same time, we counted the number of edges corresponding to each type of node to obtain 4-dimensional data. First, we used PCA to reduce the dimension of the 4-dimensional data to 3-dimensional, and then used k-means to visualize the three-dimensional data. By visualizing the position of the cluster center, Paint nodes of the same type the same color. Observing the distribution of nodes in three-dimensional space, we can judge abnormal nodes.

    3. We also converted the four edge types and nine point types into 36-dimensional data according to the value of the weight attribute. Each dimension represents the weight sum of the edges with the corresponding attributes and the points with the corresponding attributes. Use the DBSCAN density-based clustering method to cluster the 36-dimensional feature data. The DBSCAN algorithm can help us directly find the abnormal points that deviate from each cluster center. We adjusted the parameters of eps and min_samples and performed 22050 times of training , counted the number of abnormal occurrences of each point in 22050 times, and finally expressed it with a histogram and a hierarchical pie chart. The deviation points found by DBSCAN are abnormal points that may be illegally fished. Then we performed bandwith clustering on the 36-dimensional data. After 100 model iterations, we found that bandwith=55 works best, and can divide points into two categories from 3428 points, of which 8 points belong to one category and are abnormal points. Finally, we reduced the 36-dimensional data to 2D and 3D for easy visualization.

2. Key Design Decision Reasons

    1. Dimensionality reduction - 2, 3D data is easy to visualize

    2. Clustering——Since there is no known indicator related to illegal fishing, unsupervised learning method is used for judgment. By observing the number of points contained in different classes and the distance between each node and the cluster center, it can be judged whether abnormal

    3. Directed force graph - all nodes can be displayed through the directed force graph, and other analysis results can be presented on the directed force graph

    4. Extract the features of points and edges as much as possible - 36-dimensional data

3. The role of visualization and interaction

    1. In k-means, by referencing the OrbitControls library, 3D image display is realized. Users can drag the image arbitrarily to better observe the distribution of each node and the distance from the cluster center. At the same time, the search and mark function is added. Users can search for the node ID they want to know, and the corresponding ID will be displayed in bold and red on the web page. Users can also tune hyperparameters K and number of iterations to find the best results.

    2. In the directed force graph, the user can not only click on a node for analysis, but also search. At the same time, the number of hops can be set to display the nodes connected to the target node within the set hop number. Among them, the abnormal nodes obtained through other analysis, if they are connected to the node within a given number of hops, will be displayed in red, and the node information will be displayed on the right side of the page, and the number of abnormal nodes connected to will be counted.

    3. In DBSCAN, the number of times each point is considered as an abnormal point is represented by a histogram and a hierarchical pie chart. The higher the number of times considered as an abnormal point, the more likely it is to become an illegal fishing point.

    4. In bandwith, users can see the visualization results after dimension reduction, and users can better observe the position of abnormal points in the dimension reduction space

    5. In the parallel coordinate diagram, each line represents a point, and the user can see the weight comparison of each point in nine dimensions. The nine dimensions represent nine types. If there is a bump, it means that the point is related to the dimension. The corresponding types of points are closely related. At the same time, the graph provides a selection function, and users can view the visualization results of points in a specific area by selecting them with the mouse.

4. Anomalies in visualization

    1. In the k-means graph, classes that are far from the cluster center and have fewer nodes in the class will be classified as abnormal points

    2. The darker points in the circular will be classified as abnormal points

    3. By counting the number of abnormal nodes connected to each node in each hop, it is found that it conforms to the normal distribution, and the mean and variance are calculated. Through the 3 sigma rule, combined with the number of abnormal nodes counted in the directed force graph, the previously unanalyzed outliers were judged.

    4. In DBSCAN, the number of abnormal points considered to be greater than 1000 is considered to be a point that may become illegal fishing.

    5. In bandwith, the endpoint of a line segment in three-dimensional space (indicated by a yellow node) is a point that may become illegal fishing.

    6. In the parallel coordinates diagram, the raised areas in the 'vessel' dimension are points that may become illegal fishing.

5. Key assumptions

    Fits a normal distribution
