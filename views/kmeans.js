// 加载数据
function loadData(fileName, k, iterations) {
    // 读取 CSV 文件
    d3.text(fileName + '.csv').then(function (text) {
        var data = d3.csvParse(text, function (d) {
            return {
                id: d.ID,
                membership_num: +d.membership_num,
                partnership_num: +d.partnership_num,
                ownership_num: +d.ownership_num
            };
        });

        // 清空图表
        var chartElement = document.getElementById('chart');
        while (chartElement.firstChild) {
            chartElement.firstChild.remove();
        }
        // 聚类算法
        function kMeansClustering(data, k, iterations) {
            // 生成随机的初始聚类中心
            var centroids = [];
            for (var i = 0; i < k; i++) {
                centroids.push({
                    membership_num: Math.random() * d3.max(data, function (d) { return d.membership_num; }),
                    partnership_num: Math.random() * d3.max(data, function (d) { return d.partnership_num; }),
                    ownership_num: Math.random() * d3.max(data, function (d) { return d.ownership_num; })
                });
            }

            // 迭代计算聚类
            for (var iter = 0; iter < iterations; iter++) {
                // 初始化聚类簇
                var clusters = [];
                for (var j = 0; j < k; j++) {
                    clusters.push([]);
                }

                // 将每个点分配到最近的聚类中心
                data.forEach(function (d) {
                    var minDistance = Infinity;
                    var closestCluster = 0;

                    centroids.forEach(function (centroid, index) {
                        var distance = Math.sqrt(
                            Math.pow(d.membership_num - centroid.membership_num, 2) +
                            Math.pow(d.partnership_num - centroid.partnership_num, 2) +
                            Math.pow(d.ownership_num - centroid.ownership_num, 2)
                        );

                        if (distance < minDistance) {
                            minDistance = distance;
                            closestCluster = index;
                        }
                    });

                    clusters[closestCluster].push(d);
                });

                // 更新聚类中心为每个簇的均值
                centroids.forEach(function (centroid, index) {
                    if (clusters[index].length > 0) {
                        var sumMembership = 0;
                        var sumPartnership = 0;
                        var sumOwnership = 0;

                        clusters[index].forEach(function (d) {
                            sumMembership += d.membership_num;
                            sumPartnership += d.partnership_num;
                            sumOwnership += d.ownership_num;
                        });

                        centroid.membership_num = sumMembership / clusters[index].length;
                        centroid.partnership_num = sumPartnership / clusters[index].length;
                        centroid.ownership_num = sumOwnership / clusters[index].length;
                    } else {
                        // 处理聚类为空的情况
                        centroid.membership_num = 0;
                        centroid.partnership_num = 0;
                        centroid.ownership_num = 0;
                    }
                });
            }

            return clusters;
        }

        // 进行聚类
        var clusters = kMeansClustering(data, k, iterations);

        // 创建场景
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        // 创建渲染器
        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0xffffff); // 设置背景颜色为白色
        document.getElementById('chart').appendChild(renderer.domElement);

        // 创建点云和聚类中心
        var points = new THREE.Group();
        var centroidsGroup = new THREE.Group();
        scene.add(points);
        scene.add(centroidsGroup);

        // 创建坐标轴和标签
        createAxes();

        function createAxes() {
            var xLength = d3.max(data, function (d) { return d.membership_num; });
            var yLength = d3.max(data, function (d) { return d.partnership_num; });
            var zLength = d3.max(data, function (d) { return d.ownership_num; });

            // 创建x轴箭头
            var xAxisArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), xLength, 0x000000);
            scene.add(xAxisArrow);

            // 创建y轴箭头
            var yAxisArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), yLength, 0x000000);
            scene.add(yAxisArrow);

            // 创建z轴箭头
            var zAxisArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), zLength, 0x000000);
            scene.add(zAxisArrow);

            // 创建坐标轴标签
            var axesLabels = ['X', 'Y', 'Z'];

            var axesLabelsGroup = new THREE.Group();

            axesLabels.forEach(function (label, index) {
                var textGeometry = new THREE.TextBufferGeometry(label, {
                    size: 4,
                    height: 0.5
                });
                var textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
                var textMesh = new THREE.Mesh(textGeometry, textMaterial);
                if (index === 0) {
                    textMesh.position.set(xLength + 2, -2, 0);
                } else if (index === 1) {
                    textMesh.position.set(0, yLength + 2, 0);
                } else if (index === 2) {
                    textMesh.position.set(0, -2, zLength + 2);
                }
                axesLabelsGroup.add(textMesh);
            });

            scene.add(axesLabelsGroup);
        }

        // 创建点云
        data.forEach(function (d) {
            var geometry = new THREE.BufferGeometry();
            var positions = new Float32Array(3);
            var colors = new Float32Array(3);

            positions[0] = d.membership_num;
            positions[1] = d.partnership_num;
            positions[2] = d.ownership_num;

            colors[0] = 1;
            colors[1] = 1;
            colors[2] = 1;

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            var pointMaterial = new THREE.PointsMaterial({ size: 1, vertexColors: true });

            var pointCloud = new THREE.Points(geometry, pointMaterial);
            pointCloud.userData.id = d.id;
            points.add(pointCloud);

            if (!pointMaterial) {
                console.log("Point material is undefined");
                return;
            }
        });

        // 创建聚类中心点和同一类点使用相同颜色表示
        clusters.forEach(function (cluster, index) {
            var color = new THREE.Color(Math.random(), Math.random(), Math.random()); // 生成随机颜色

            // 创建聚类中心点
            var centroidGeometry = new THREE.SphereGeometry(1, 8, 8); // 设置聚类中心点的几何体
            var centroidMaterial = new THREE.MeshBasicMaterial({ color: color }); // 设置聚类中心点的材质
            var centroidMesh = new THREE.Mesh(centroidGeometry, centroidMaterial);
            centroidMesh.position.set(cluster[0].membership_num, cluster[0].partnership_num, cluster[0].ownership_num);
            centroidsGroup.add(centroidMesh);

            // 设置同一类点的颜色
            cluster.forEach(function (d) {
                var pointCloud = points.children.find(function (child) {
                    return child.userData.id === d.id;
                });

                if (pointCloud && pointCloud.material) {
                    pointCloud.material.color.set(color);
                }
            });
        });

        // 创建控制器
        var controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.update();

        // 调整相机位置
        camera.position.z = 50;

        // 监听鼠标移动事件
        document.addEventListener('mousemove', onDocumentMouseMove, false);

        function onDocumentMouseMove(event) {
            var mouse = new THREE.Vector2();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            var raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);

            var intersects = raycaster.intersectObjects(points.children);

            if (intersects.length > 0) {
                var selectedObject = intersects[0].object;
                var id = selectedObject.userData.id;

                var idDisplay = document.getElementById('id-display');
                idDisplay.style.left = (event.clientX + 20) + 'px';
                idDisplay.style.top = (event.clientY + 20) + 'px';
                idDisplay.textContent = "ID: " + id;
                idDisplay.style.display = 'block';

                if (event.which === 1) {
                    console.log("Selected ID:", id);
                }
            } else {
                var idDisplay = document.getElementById('id-display');
                idDisplay.style.display = 'none';
            }
        }
        // 搜索并标记节点
        function highlightNodeById(id) {
            // 先重置所有点的颜色为默认颜色
            points.children.forEach(function (pointCloud) {
                if (pointCloud.material) {
                    pointCloud.material.color.set(0xffffff);
                }
            });

            // 搜索匹配的节点并标红
            var matchedNode = data.find(function (d) {
                return d.id === id;
            });

            if (matchedNode) {
                var matchedPointCloud = points.children.find(function (pointCloud) {
                    return pointCloud.userData.id === matchedNode.id;
                });

                if (matchedPointCloud && matchedPointCloud.material) {
                    matchedPointCloud.material.color.set(0xff0000); // 将匹配的节点标为红色
                } else {
                    console.log("PointCloud not found for ID:", id);
                }
            } else {
                console.log("No matching node found for ID:", id);
            }
        }
        // 根据 ID 高亮显示节点
        function highlightNodeById(id) {
            // 清除之前的高亮节点
            points.children.forEach(function (point) {
                if (point.material) {
                    if (point.userData.id === id) {
                        point.material.color.set(0xff0000); // 设置为红色
                    } 
                }
            });
        }

        // 监听 ID 搜索按钮点击事件
        document.getElementById('id-search-button').addEventListener('click', function () {
            var id = document.getElementById('id-search-input').value;
            highlightNodeById(id);
        });


        // 渲染场景
        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
        animate();
    });
}


// 默认的文件名、聚类数量和迭代次数
window.onload = function () {
    var fileNameSelect = document.getElementById('file-name-select');
    var kInput = document.getElementById('k-input');
    var iterationsInput = document.getElementById('iterations-input');

    document.getElementById('submit-button').addEventListener('click', function () {
        var fileName = fileNameSelect.value;
        var k = parseInt(kInput.value) || 2;
        var iterations = parseInt(iterationsInput.value) || 10;
        loadData(fileName, k, iterations);
    });

    document.getElementById('id-search-button').addEventListener('click', function () {
        var id = document.getElementById('id-search-input').value;
        highlightNodeById(id);
    });

    loadData('vessel', 2, 20); // 默认加载数据
};
